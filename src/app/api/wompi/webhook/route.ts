import { NextRequest, NextResponse } from "next/server";
import { failure, requireDemo } from "@/lib/payment-http";
import { applyPaymentEvent } from "@/lib/payment-service";

export async function POST(request: NextRequest) {
  try {
    requireDemo();
    const result = await applyPaymentEvent(await request.json(), request.headers.get("X-Event-Checksum"));
    return NextResponse.json({ success: true, signatureVerified: true, ...result });
  } catch (error) {
    return failure(error);
  }
}
