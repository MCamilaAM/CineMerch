import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { failure, PaymentError, requireOrderAccess } from "@/lib/payment-http";
import { latestAttempt, serializeTransaction } from "@/lib/payment-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { transactions: latestAttempt } });
    requireOrderAccess(request, order?.paymentAccessToken);
    if (!order) throw new PaymentError(404, "Pedido no encontrado");
    return NextResponse.json({
      success: true, orderNumber: order.orderNumber, orderStatus: order.status,
      paymentStatus: order.paymentStatus, paidAt: order.paidAt, transaction: serializeTransaction(order.transactions[0]),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const response = failure(error);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
