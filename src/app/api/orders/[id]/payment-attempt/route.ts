import { NextRequest, NextResponse } from "next/server";
import { failure, PaymentError, requireDemo, requireOrderAccess } from "@/lib/payment-http";
import { latestAttempt, newAttempt, serializeTransaction, writePayment } from "@/lib/payment-service";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireDemo();
    const transaction = await writePayment(async (db) => {
      const order = await db.order.findUnique({ where: { id: params.id }, include: { transactions: latestAttempt } });
      requireOrderAccess(request, order?.paymentAccessToken);
      const attempt = order!.transactions[0];
      if (!order || attempt?.provider !== "WOMPI_SIMULATED" || order.paymentStatus === "APPROVED") {
        throw new PaymentError(409, "El pedido no admite otro intento");
      }
      if (attempt.status === "PENDING") return attempt;
      if (!["DECLINED", "ERROR"].includes(attempt.status)) throw new PaymentError(409, "El intento no se puede reabrir");
      const claimed = await db.order.updateMany({
        where: { id: order.id, paymentStatus: attempt.status },
        data: { paymentStatus: "PENDING", status: "PENDIENTE" },
      });
      if (!claimed.count) throw new PaymentError(409, "El intento ya cambió de estado");
      const createdAt = new Date(Math.max(Date.now(), attempt.createdAt.getTime() + 1));
      return db.paymentTransaction.create({ data: { orderId: order.id, createdAt, ...newAttempt(order) } });
    });
    return NextResponse.json({ success: true, transaction: serializeTransaction(transaction) });
  } catch (error) {
    return failure(error);
  }
}
