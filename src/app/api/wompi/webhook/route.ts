import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWompiWebhookSignature } from "@/lib/wompi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = request.headers.get("x-event-timestamp") || String(Date.now());
    const signature = request.headers.get("x-signature-checksum") || "";

    // Signature verification (in production with secret)
    const isValid = verifyWompiWebhookSignature(body.data || {}, timestamp, signature);

    const transaction = body.data?.transaction;
    if (transaction && transaction.reference) {
      const { reference, status } = transaction;

      // Update order status if order exists
      await prisma.order.updateMany({
        where: { orderNumber: reference },
        data: {
          paymentStatus: status, // APPROVED, DECLINED, PENDING
          status: status === "APPROVED" ? "PAGADO" : "PENDIENTE",
        },
      });
    }

    return NextResponse.json({
      received: true,
      signatureVerified: isValid,
      timestamp,
    });
  } catch (error) {
    console.error("Wompi webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Error procesando webhook de Wompi" },
      { status: 500 }
    );
  }
}
