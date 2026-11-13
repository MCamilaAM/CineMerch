import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { failure, objectBody, PaymentError, requireDemo, requireOrderAccess } from "@/lib/payment-http";
import { applyPaymentEvent } from "@/lib/payment-service";
import { paymentStates, signSimulation, type PaymentState } from "@/lib/wompi";
import { paymentMethods } from "@/lib/checkout-options";

export async function POST(request: NextRequest) {
  try {
    requireDemo();
    const { transactionId, scenario } = objectBody(await request.json());
    if (typeof transactionId !== "string" || !paymentStates.includes(scenario as PaymentState)) {
      throw new PaymentError(400, "Intento o escenario inválido");
    }
    const attempt = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId }, include: { order: true },
    });
    requireOrderAccess(request, attempt?.order.paymentAccessToken);
    if (!attempt || attempt.provider !== "WOMPI_SIMULATED" || !attempt.paymentMethod.startsWith("WOMPI_") ||
        !Object.prototype.hasOwnProperty.call(paymentMethods, attempt.paymentMethod)) {
      throw new PaymentError(404, "Intento no encontrado");
    }
    const result = await applyPaymentEvent(signSimulation(attempt, scenario as PaymentState));
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return failure(error);
  }
}
