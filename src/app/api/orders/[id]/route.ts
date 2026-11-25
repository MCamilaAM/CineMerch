import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { failure, objectBody, PaymentError, requireAdmin } from "@/lib/payment-http";
import { readText } from "@/lib/order-pricing";
import { publicOrder, writePayment } from "@/lib/payment-service";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(request);
    const body = objectBody(await request.json());
    const keys = Object.keys(body);
    if (!keys.length || keys.some((key) => !["status", "carrier", "trackingNumber"].includes(key))) {
      throw new PaymentError(400, "Campos logísticos inválidos");
    }
    const status = body.status === undefined ? undefined : readText(body.status, "Estado", 30);
    const carrier = body.carrier == null ? body.carrier : readText(body.carrier, "Transportadora", 120);
    const trackingNumber = body.trackingNumber == null ? body.trackingNumber : readText(body.trackingNumber, "Guía", 120);
    const updated = await writePayment(async (db) => {
      const order = await db.order.findUnique({ where: { id: params.id } });
      if (!order) throw new PaymentError(404, "Pedido no encontrado");
      const next = order.status === "PAGADO" ? "ENVIADO" : order.status === "ENVIADO" ? "ENTREGADO" : null;
      if (order.paymentStatus !== "APPROVED" || (status && status !== next)) {
        throw new PaymentError(409, "Transición logística no permitida");
      }
      const result = await db.order.updateMany({
        where: { id: order.id, status: order.status, paymentStatus: "APPROVED" },
        data: { status, carrier, trackingNumber },
      });
      if (!result.count) throw new PaymentError(409, "El pedido cambió de estado");
      return db.order.findUniqueOrThrow({ where: { id: order.id } });
    });
    return NextResponse.json({ success: true, order: publicOrder(updated) });
  } catch (error) {
    return failure(error);
  }
}
