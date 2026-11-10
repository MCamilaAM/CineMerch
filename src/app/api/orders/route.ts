import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener órdenes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      city,
      department,
      address,
      deliveryMethod,
      paymentMethod,
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      pointsRedeemed,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos de la orden" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CNM-2026-${randomSuffix}`;

    // Calculate points earned: 1 point per $1.000 COP spent
    const pointsEarned = Math.floor(total / 1000);

    // Default carrier and tracking assignment
    let carrier = "Coordinadora Mercantil";
    let trackingNumber = `COORD-CO-${Math.floor(10000000 + Math.random() * 90000000)}`;

    if (deliveryMethod === "CONTRAENTREGA_LOCAL" || city.toLowerCase().includes("cartagena")) {
      carrier = "Mensajería Express Cartagena";
      trackingNumber = `CTG-LOCAL-${randomSuffix}`;
    }

    // Determine payment status:
    // If Contraentrega, starts as PENDIENTE de cobro al entregar
    // If Wompi Sandbox/Test, starts as APPROVED
    const paymentStatus = paymentMethod === "CONTRAENTREGA" ? "PENDING" : "APPROVED";
    const orderStatus = paymentMethod === "CONTRAENTREGA" ? "PENDIENTE" : "PAGADO";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        city: city || "Cartagena",
        department: department || "Bolívar",
        address: address || "Centro Histórico",
        deliveryMethod: deliveryMethod || "ENVIO_NACIONAL",
        paymentMethod: paymentMethod || "WOMPI_CARD",
        paymentStatus,
        status: orderStatus,
        subtotal: Number(subtotal),
        discount: Number(discount) || 0,
        shippingCost: Number(shippingCost) || 0,
        total: Number(total),
        pointsEarned,
        pointsRedeemed: Number(pointsRedeemed) || 0,
        carrier,
        trackingNumber,
        itemsJson: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: "Orden procesada exitosamente en CineMerch",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la orden" },
      { status: 500 }
    );
  }
}
