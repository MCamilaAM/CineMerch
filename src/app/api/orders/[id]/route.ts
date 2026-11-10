import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, carrier, trackingNumber, paymentStatus } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(carrier && { carrier }),
        ...(trackingNumber && { trackingNumber }),
        ...(paymentStatus && { paymentStatus }),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}
