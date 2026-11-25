import { randomUUID } from "node:crypto";
import { Prisma, type Order, type PaymentTransaction } from "@prisma/client";
import { prisma } from "./prisma";
import { PaymentError } from "./payment-http";
import { verifyEvent } from "./wompi";

export const latestAttempt = { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 } satisfies Prisma.PaymentTransactionFindManyArgs;

export function publicOrder({ checkoutIdempotencyKey, paymentAccessToken, ...order }: Order) {
  return order;
}

export function serializeTransaction(transaction?: PaymentTransaction | null) {
  if (!transaction) return null;
  const { id, reference, amountInCents, currency, status, paymentMethod, createdAt } = transaction;
  return { id, reference, amountInCents: amountInCents.toString(), currency, status, paymentMethod, createdAt };
}

export function newAttempt(order: Pick<Order, "orderNumber" | "paymentMethod" | "total">) {
  return {
    reference: `${order.orderNumber}-${randomUUID()}`,
    paymentMethod: order.paymentMethod,
    amountInCents: BigInt(order.total) * BigInt(100),
  };
}

export async function writePayment<T>(operation: (db: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(operation);
    } catch (error) {
      if (attempt >= 4 || !(error instanceof Prisma.PrismaClientKnownRequestError) ||
          !["P1008", "P2028", "P2034"].includes(error.code)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 30 * (attempt + 1)));
    }
  }
}

export async function applyPaymentEvent(input: unknown, header: string | null = null) {
  const event = verifyEvent(input, header);
  return writePayment(async (db) => {
    const attempt = await db.paymentTransaction.findUnique({
      where: { id: event.id },
      include: { order: { include: { transactions: latestAttempt } } },
    });
    if (!attempt || attempt.provider !== "WOMPI_SIMULATED") throw new PaymentError(404, "Intento no encontrado");
    const { order } = attempt;
    if (event.reference !== attempt.reference || attempt.currency !== "COP" ||
        event.amount !== attempt.amountInCents.toString() ||
        attempt.amountInCents !== BigInt(order.total) * BigInt(100)) {
      throw new PaymentError(400, "Referencia, moneda o importe inválidos");
    }

    const existing = await db.paymentEvent.findUnique({ where: { externalEventId: event.externalEventId } });
    if (existing) return { duplicate: true, transaction: serializeTransaction(attempt) };
    if (order.transactions[0]?.id !== attempt.id || (attempt.status !== "PENDING" && attempt.status !== event.status)) {
      throw new PaymentError(409, "El intento ya no admite ese cambio");
    }

    let updated = attempt;
    if (attempt.status === "PENDING" && event.status !== "PENDING") {
      const finalizedAt = new Date();
      const changed = await db.paymentTransaction.updateMany({
        where: { id: attempt.id, status: "PENDING" },
        data: { status: event.status, scenario: event.status, finalizedAt },
      });
      if (!changed.count) throw new PaymentError(409, "El intento ya cambió de estado");

      const approved = event.status === "APPROVED";
      if (approved) {
        const items: { productId: string; quantity: number }[] = JSON.parse(order.itemsJson);
        for (const { productId, quantity } of items) {
          const stock = await db.product.updateMany({
            where: { id: productId, stock: { gte: quantity } },
            data: { stock: { decrement: quantity } },
          });
          if (!stock.count) throw new PaymentError(409, "Inventario insuficiente para aprobar");
        }
      }
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: event.status, status: approved ? "PAGADO" : "PENDIENTE",
          paidAt: approved ? finalizedAt : null, pointsEarned: approved ? Math.floor(order.total / 1000) : 0,
        },
      });
      updated = { ...attempt, status: event.status };
    }

    await db.paymentEvent.create({
      data: {
        externalEventId: event.externalEventId, transactionId: attempt.id,
        eventType: "transaction.updated", eventStatus: event.status, signatureValid: true,
      },
    });
    return { duplicate: false, transaction: serializeTransaction(updated) };
  });
}
