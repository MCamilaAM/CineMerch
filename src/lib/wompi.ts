import { createHash } from "node:crypto";
import { isConfiguredSecret, objectBody, PaymentError, safeEqual } from "./payment-http";

export const paymentStates = ["PENDING", "APPROVED", "DECLINED", "ERROR"] as const;
export type PaymentState = typeof paymentStates[number];

export const eventProperties = [
  "transaction.id", "transaction.reference", "transaction.status",
  "transaction.amount_in_cents", "transaction.currency",
];

export function checksum(data: Record<string, unknown>, properties: unknown, timestamp: unknown) {
  const secret = process.env.MOCK_WOMPI_EVENT_SECRET;
  if (!isConfiguredSecret(secret)) throw new PaymentError(401, "Firma de simulación no disponible");
  if (!Array.isArray(properties) || properties.length < 3 || properties.length > 10 ||
      new Set(properties).size !== properties.length ||
      ![eventProperties[0], eventProperties[2], eventProperties[3]].every((property) => properties.includes(property)) ||
      typeof timestamp !== "number" || !Number.isSafeInteger(timestamp) || timestamp < 1) {
    throw new PaymentError(401, "Firma inválida");
  }

  const values = properties.map((property) => {
    if (typeof property !== "string" || !/^transaction\.[a-z_]{1,40}$/.test(property)) {
      throw new PaymentError(401, "Firma inválida");
    }
    let value: unknown = data;
    for (const key of property.split(".")) {
      if (!value || typeof value !== "object" || !Object.prototype.hasOwnProperty.call(value, key)) {
        throw new PaymentError(401, "Firma inválida");
      }
      value = (value as Record<string, unknown>)[key];
    }
    if (typeof value !== "string" && !(typeof value === "number" && Number.isSafeInteger(value))) {
      throw new PaymentError(401, "Firma inválida");
    }
    return String(value);
  });
  return createHash("sha256").update(values.join("") + timestamp + secret).digest("hex");
}

export function verifyEvent(input: unknown, header: string | null) {
  const event = objectBody(input);
  if (!event.signature || typeof event.signature !== "object" || Array.isArray(event.signature)) {
    throw new PaymentError(401, "Firma requerida");
  }
  const signature = objectBody(event.signature);
  const data = objectBody(event.data);
  const expected = checksum(data, signature.properties, event.timestamp);
  const supplied = header === null ? [] : [header];
  const checksums: unknown[] = "checksum" in signature ? [...supplied, signature.checksum] : supplied;
  if (!checksums.length || !checksums.every((value) => typeof value === "string" && safeEqual(value, expected))) {
    throw new PaymentError(401, "Firma inválida");
  }
  const transaction = objectBody(data.transaction);
  if (event.event !== "transaction.updated" || event.environment !== "test" ||
      typeof transaction.id !== "string" || typeof transaction.reference !== "string" ||
      !paymentStates.includes(transaction.status as PaymentState) ||
      typeof transaction.amount_in_cents !== "string" || transaction.currency !== "COP") {
    throw new PaymentError(400, "Evento de pago inválido");
  }
  const externalEventId = createHash("sha256").update(JSON.stringify([
    expected, event.event, event.environment, transaction.id, transaction.reference,
    transaction.status, transaction.amount_in_cents, transaction.currency,
  ])).digest("hex");
  return { ...transaction, id: transaction.id, reference: transaction.reference, status: transaction.status as PaymentState, amount: transaction.amount_in_cents, externalEventId };
}

export function signSimulation(attempt: { id: string; reference: string; amountInCents: bigint; currency: string }, status: PaymentState) {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = { transaction: {
    id: attempt.id, reference: attempt.reference, status,
    amount_in_cents: attempt.amountInCents.toString(), currency: attempt.currency,
  } };
  return {
    event: "transaction.updated", environment: "test", timestamp, sent_at: new Date().toISOString(),
    data, signature: { properties: eventProperties, checksum: checksum(data, eventProperties, timestamp) },
  };
}
