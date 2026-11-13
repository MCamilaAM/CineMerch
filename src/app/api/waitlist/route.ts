import { hasAdminAccess } from "@/lib/payment-http";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const totalLeads = await prisma.waitlistLead.count();
    const targetCapacity = 100;
    const remainingSpots = Math.max(0, targetCapacity - totalLeads);

    const leads = hasAdminAccess(request) ? await prisma.waitlistLead.findMany({
      orderBy: { createdAt: "desc" },
    }) : [];

    return NextResponse.json({
      success: true,
      totalLeads,
      targetCapacity,
      remainingSpots,
      leads,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar lista de espera" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Por favor completa todos los campos (nombre, correo y WhatsApp)." },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await prisma.waitlistLead.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        couponCode: existing.couponCode,
        discountPercent: existing.discountPercent,
        message: "¡Ya estabas registrado en los Primeros 100 Cinéfilos! Aquí tienes tu cupón.",
      });
    }

    const currentCount = await prisma.waitlistLead.count();
    const suffix = String(currentCount + 1).padStart(3, "0");
    const couponCode = `CINEMERCH10-${suffix}`;

    const lead = await prisma.waitlistLead.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        couponCode,
        discountPercent: 10,
      },
    });

    const newTotal = currentCount + 1;
    const remainingSpots = Math.max(0, 100 - newTotal);

    return NextResponse.json({
      success: true,
      lead,
      couponCode,
      remainingSpots,
      message: "¡Registro exitoso! Disfruta de tu bono del 10% en preventas y catálogo.",
    });
  } catch (error) {
    console.error("Error creating waitlist lead:", error);
    return NextResponse.json(
      { success: false, error: "Error al registrar en la lista de espera" },
      { status: 500 }
    );
  }
}
