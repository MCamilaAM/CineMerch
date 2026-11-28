import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { failure, hasAdminAccess, PaymentError, requireOrderAccess } from "@/lib/payment-http";
import { latestAttempt, serializeTransaction, writePayment } from "@/lib/payment-service";
import { isReceiptFilename, maxReceiptBytes, requiresPaymentReceipt } from "@/lib/payment-receipt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

async function receiptForm(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) throw new PaymentError(400, "Adjunta un comprobante JPG.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxReceiptBytes + 65536) {
      await reader.cancel();
      throw new PaymentError(413, "El comprobante debe pesar como máximo 5 MB.");
    }
    chunks.push(value);
  }
  return new Response(new Uint8Array(Buffer.concat(chunks)), {
    headers: { "Content-Type": request.headers.get("content-type") ?? "" },
  }).formData().catch(() => { throw new PaymentError(400, "Adjunta un comprobante JPG."); });
}

function failed(error: unknown) {
  const response = failure(error);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { transactions: latestAttempt } });
    requireOrderAccess(request, order?.paymentAccessToken);
    const attempt = order!.transactions[0];
    if (!attempt || !requiresPaymentReceipt(attempt.paymentMethod) || attempt.status !== "PENDING") {
      throw new PaymentError(409, "Solo puedes adjuntar un comprobante a un pago pendiente por Bre-B, PSE, Bancolombia o Nequi.");
    }
    if (Number(request.headers.get("content-length")) > maxReceiptBytes + 65536) {
      throw new PaymentError(413, "El comprobante debe pesar como máximo 5 MB.");
    }
    const form = await receiptForm(request);
    if (form.get("transactionId") !== attempt.id) throw new PaymentError(409, "El intento de pago cambió. Consulta su estado y vuelve a subir el comprobante.");
    const file = form.get("receipt");
    if (!(file instanceof File) || !isReceiptFilename(file.name) || (file.type && file.type !== "image/jpeg")) {
      throw new PaymentError(400, "El comprobante debe ser una imagen JPG (.jpg o .jpeg).");
    }
    if (!file.size || file.size > maxReceiptBytes) throw new PaymentError(413, "El comprobante debe pesar entre 1 byte y 5 MB.");
    const bytes = Buffer.from(await file.arrayBuffer());
    let image: Buffer;
    try {
      const decoder = sharp(bytes, { limitInputPixels: 40_000_000, failOn: "error" });
      if ((await decoder.metadata()).format !== "jpeg") throw new Error("Formato inválido");
      // Decode and re-encode to verify the image and discard embedded metadata.
      image = await decoder.rotate().jpeg({ quality: 90 }).toBuffer();
    } catch {
      throw new PaymentError(400, "No se pudo leer el JPG. Selecciona otra imagen válida.");
    }
    if (image.length > maxReceiptBytes) throw new PaymentError(413, "La imagen procesada supera los 5 MB. Selecciona una más pequeña.");
    const transaction = await writePayment(async (db) => {
      const current = await db.order.findUniqueOrThrow({ where: { id }, include: { transactions: latestAttempt } });
      const latest = current.transactions[0];
      if (latest?.id !== attempt.id || latest.status !== "PENDING" || current.paymentStatus !== "PENDING") {
        throw new PaymentError(409, "El intento ya no admite un comprobante.");
      }
      if (!latest.receipt) {
        const receipt = await db.paymentReceipt.create({ data: { transactionId: latest.id, image }, select: { createdAt: true } });
        return serializeTransaction({ ...latest, receipt });
      }
      return serializeTransaction(latest);
    });
    return NextResponse.json({ success: true, transaction }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return failed(error);
  }
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { transactions: latestAttempt } });
    if (!hasAdminAccess(request)) requireOrderAccess(request, order?.paymentAccessToken);
    const attempt = order?.transactions[0];
    if (!attempt?.receipt) throw new PaymentError(404, "Comprobante no encontrado");
    const receipt = await prisma.paymentReceipt.findUniqueOrThrow({ where: { transactionId: attempt.id }, select: { image: true } });
    return new Response(new Uint8Array(receipt.image), { headers: {
      "Content-Type": "image/jpeg", "Content-Disposition": 'inline; filename="comprobante.jpg"',
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    } });
  } catch (error) {
    return failed(error);
  }
}
