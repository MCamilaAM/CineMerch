import { NextResponse } from "next/server";
import { failure, requireAdmin } from "@/lib/payment-http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    requireAdmin(request);
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const response = failure(error);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
