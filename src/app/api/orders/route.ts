import { randomBytes, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { failure, objectBody, PaymentError, requireAdmin, requireDemo } from "@/lib/payment-http";
import { parseCheckout, priceOrder } from "@/lib/order-pricing";
import { latestAttempt, newAttempt, publicOrder, serializeTransaction, writePayment } from "@/lib/payment-service";

export const dynamic = "force-dynamic";

type OrderWithAttempts = Prisma.OrderGetPayload<{ include: { transactions: true } }>;

function checkoutResponse({ transactions, paymentAccessToken, ...order }: OrderWithAttempts) {
  return NextResponse.json({
    success: true, order: publicOrder({ ...order, paymentAccessToken }),
    paymentAccessToken, transaction: serializeTransaction(transactions[0]),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { transactions: latestAttempt } });
    return NextResponse.json({
      success: true,
      orders: orders.map(({ transactions, ...order }) => ({
        ...publicOrder(order), transaction: serializeTransaction(transactions[0]),
      })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = objectBody(await request.json());
    const key = body.checkoutIdempotencyKey;
    if (typeof key !== "string" || !/^[a-zA-Z0-9_-]{32,128}$/.test(key)) {
      throw new PaymentError(400, "Clave de checkout inválida");
    }
    const checkout = parseCheckout(body);
    const isWompi = checkout.customer.paymentMethod !== "CONTRAENTREGA";
    if (isWompi) requireDemo();
    const lookup = { where: { checkoutIdempotencyKey: key }, include: { transactions: latestAttempt } };

    try {
      const order = await writePayment(async (db) => {
        const existing = await db.order.findUnique(lookup);
        if (existing) {
          if (existing.paymentMethod !== "CONTRAENTREGA") requireDemo();
          return existing;
        }
        const price = await priceOrder(db, checkout);
        const orderData = {
          ...checkout.customer, ...price, checkoutIdempotencyKey: key,
          orderNumber: `CNM-${new Date().getFullYear()}-${randomUUID()}`,
          paymentAccessToken: randomBytes(32).toString("hex"),
        };
        return db.order.create({
          data: { ...orderData, transactions: isWompi ? { create: newAttempt(orderData) } : undefined },
          include: { transactions: latestAttempt },
        });
      });
      return checkoutResponse(order);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const existing = await prisma.order.findUnique(lookup);
        if (existing) {
          if (existing.paymentMethod !== "CONTRAENTREGA") requireDemo();
          return checkoutResponse(existing);
        }
      }
      throw error;
    }
  } catch (error) {
    return failure(error);
  }
}
