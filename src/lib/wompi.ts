import crypto from "crypto";

export interface WompiTransactionPayload {
  reference: string;
  amountInCents: number; // In centavos (e.g. $100.000 COP -> 10000000)
  currency: string;
  customerEmail: string;
  paymentMethod: string;
}

const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_secret_2026";
export const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_cinemerch_2026";

/**
 * Generates SHA-256 integrity signature for Wompi Checkout
 * Signature string: reference + amountInCents + currency + integritySecret
 */
export function generateWompiIntegritySignature(
  reference: string,
  amountInCents: number,
  currency = "COP"
): string {
  const rawString = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
  return crypto.createHash("sha256").update(rawString).digest("hex");
}

/**
 * Validates incoming Wompi webhook signature
 */
export function verifyWompiWebhookSignature(
  eventData: {
    transaction?: {
      id: string;
      status: string;
      amount_in_cents: number;
      reference: string;
    };
  },
  timestamp: string,
  checksum: string
): boolean {
  if (!eventData.transaction) return false;
  const { id, status, amount_in_cents } = eventData.transaction;
  const rawString = `${id}${status}${amount_in_cents}${timestamp}${WOMPI_INTEGRITY_SECRET}`;
  const calculatedChecksum = crypto.createHash("sha256").update(rawString).digest("hex");
  return calculatedChecksum === checksum;
}
