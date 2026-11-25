import { privacyVersion } from "@/lib/store-policy";
import { failure, objectBody, PaymentError, hasAdminAccess } from "@/lib/payment-http";
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
    const body = objectBody(await request.json());
    const { fullName, email, phone } = body;

    if (body.privacyVersion !== privacyVersion) {
      throw new PaymentError(400, "Autoriza el tratamiento de datos para registrar tu interés.");
    }
    if (typeof fullName !== "string" || !fullName.trim() || fullName.length > 120 ||
        typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof phone !== "string" || phone.length > 30 || !/^\+?[\d ()-]{7,30}$/.test(phone.trim()) ||
        !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) {
      throw new PaymentError(400, "Verifica el nombre, correo y teléfono.");
    }

    // Preserve existing registrations without recording a new consent as a side effect.
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

    await prisma.waitlistLead.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        couponCode,
        discountPercent: 10,
        privacyAcceptedAt: new Date(),
        privacyVersion,
      },
    });

    const newTotal = currentCount + 1;
    const remainingSpots = Math.max(0, 100 - newTotal);

    return NextResponse.json({
      success: true,
      couponCode,
      remainingSpots,
      message: "¡Registro exitoso! Disfruta de tu bono del 10% en preventas y catálogo.",
    });
  } catch (error) {
    return failure(error);
  }
}
