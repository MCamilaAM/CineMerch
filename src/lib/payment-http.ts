import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export class PaymentError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function failure(error: unknown) {
  const status = error instanceof PaymentError ? error.status : error instanceof SyntaxError ? 400 : 500;
  const message = error instanceof PaymentError ? error.message : status === 400 ? "JSON inválido" : "Error interno";
  return NextResponse.json({ success: false, error: message }, { status });
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isConfiguredSecret(secret: string | undefined): secret is string {
  return Boolean(secret && secret.trim().length >= 32 && !secret.toLowerCase().includes("reemplazar"));
}

export function requireDemo() {
  if (process.env.PAYMENT_PROVIDER !== "WOMPI_SIMULATED" || process.env.PAYMENT_SIMULATION_ENABLED !== "true") {
    throw new PaymentError(404, "Simulación no disponible");
  }
}

export function hasAdminAccess(request: Request) {
  const secret = process.env.ADMIN_ACCESS_TOKEN;
  return isConfiguredSecret(secret) && safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`);
}

export function requireAdmin(request: Request) {
  if (!hasAdminAccess(request)) throw new PaymentError(401, "Acceso administrativo requerido");
}

export function requireOrderAccess(request: Request, token?: string | null) {
  if (!token || !safeEqual(request.headers.get("authorization") ?? "", `Bearer ${token}`)) {
    throw new PaymentError(404, "Pedido no encontrado");
  }
}

export function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new PaymentError(400, "Datos inválidos");
  return value as Record<string, unknown>;
}
