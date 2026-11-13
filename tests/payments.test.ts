import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { NextRequest } from "next/server";
import { POST as create, GET as list } from "../src/app/api/orders/route";
import { PATCH as patch } from "../src/app/api/orders/[id]/route";
import { POST as retry } from "../src/app/api/orders/[id]/payment-attempt/route";
import { GET as status } from "../src/app/api/orders/[id]/payment-status/route";
import { POST as simulate } from "../src/app/api/wompi/simulate/route";
import { POST as webhook } from "../src/app/api/wompi/webhook/route";
import { POST as createProduct } from "../src/app/api/products/route";
import { GET as waitlist } from "../src/app/api/waitlist/route";
import { prisma } from "../src/lib/prisma";
import { checksum, signSimulation, type PaymentState } from "../src/lib/wompi";
import { seedAccessories } from "../prisma/seed-accessories";

const product = "prod-demo";
const second = "prod-demo-second";
const admin = process.env.ADMIN_ACCESS_TOKEN;
const valid = {
  customerName: "Cliente demo", customerEmail: "demo@example.test", customerPhone: "3000000000",
  city: "Cartagena", department: "Bolívar", address: "Dirección de prueba",
  deliveryMethod: "ENVIO_NACIONAL", paymentMethod: "WOMPI_NEQUI",
  items: [{ id: product, quantity: 1 }], pointsRedeemed: 0,
};

function request(method: string, body?: unknown, token?: string, headers?: Record<string, string>) {
  return new NextRequest("http://localhost/api", {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function checkout(body: Record<string, unknown> = {}, key = randomUUID()) {
  const response = await create(request("POST", { ...valid, checkoutIdempotencyKey: key, ...body }));
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
}

function context(data: { order: { id: string } }) {
  return { params: { id: data.order.id } };
}

async function stock(id = product) {
  return (await prisma.product.findUniqueOrThrow({ where: { id } })).stock;
}

async function signed(id: string, state: PaymentState) {
  return signSimulation(await prisma.paymentTransaction.findUniqueOrThrow({ where: { id } }), state);
}

function resolveAttempt(data: { transaction: { id: string }; paymentAccessToken: string }, scenario: PaymentState) {
  return simulate(request("POST", { transactionId: data.transaction.id, scenario }, data.paymentAccessToken));
}

before(async () => {
  await prisma.product.createMany({ data: [product, second].map((id) => ({
    id, title: id, overview: "Demo", price: 100000, format: "Merch", category: "Accesorios",
    director: "CineMerch", year: 2026, posterUrl: "/demo.png", stock: 25,
  })) });
  await seedAccessories(prisma);
  await prisma.waitlistLead.create({ data: { fullName: "Demo", email: "lead@example.test", phone: "3000000000", couponCode: "CINEMERCH10-123" } });
});

after(() => prisma.$disconnect());

test("1. Registro pendiente, precio autoritativo, cupón e idempotencia", async () => {
  const key = randomUUID();
  const initial = await stock();
  const data = await checkout({ couponCode: "CINE10", total: 1, discount: 90000 }, key);
  assert.equal(data.order.subtotal, 100000);
  assert.equal(data.order.discount, 10000);
  assert.equal(data.order.shippingCost, 8000);
  assert.equal(data.order.total, 98000);
  assert.equal(data.order.status, "PENDIENTE");
  assert.equal(data.order.paymentStatus, "PENDING");
  assert.equal(data.order.pointsEarned, 0);
  assert.equal(data.order.trackingNumber, null);
  assert.equal(data.order.checkoutIdempotencyKey, undefined);
  assert.equal(data.transaction.amountInCents, "9800000");
  assert.equal(await stock(), initial);
  const again = await checkout({}, key);
  assert.equal(again.order.id, data.order.id);
  assert.equal(again.transaction.id, data.transaction.id);
  assert.equal(again.paymentAccessToken, data.paymentAccessToken);
});

test("2. Aprobación atómica, duplicados y eventos atrasados", async () => {
  const data = await checkout();
  const initial = await stock();
  const event = await signed(data.transaction.id, "APPROVED");
  const first = await webhook(request("POST", event));
  assert.equal(first.status, 200);
  assert.equal((await first.json()).signatureVerified, true);
  const equivalent = Object.fromEntries(Object.entries(event).reverse());
  const replay = await webhook(request("POST", equivalent));
  assert.equal((await replay.json()).duplicate, true);
  const late = await webhook(request("POST", await signed(data.transaction.id, "PENDING")));
  assert.equal(late.status, 409);
  const order = await prisma.order.findUniqueOrThrow({ where: { id: data.order.id } });
  assert.equal(order.status, "PAGADO");
  assert.equal(order.paymentStatus, "APPROVED");
  assert.ok(order.paidAt);
  assert.equal(order.pointsEarned, 108);
  assert.equal(await stock(), initial - 1);
  assert.equal(await prisma.paymentEvent.count({ where: { transactionId: data.transaction.id } }), 1);
});

test("3. PSE pendiente, rechazo, error y reintentos", async () => {
  const data = await checkout({ paymentMethod: "WOMPI_PSE" });
  const initial = await stock();
  assert.equal((await resolveAttempt(data, "PENDING")).status, 200);
  assert.equal((await resolveAttempt(data, "DECLINED")).status, 200);
  const auth = () => request("POST", undefined, data.paymentAccessToken);
  const retries = await Promise.all([retry(auth(), context(data)), retry(auth(), context(data))]);
  for (const response of retries) assert.equal(response.status, 200, await response.clone().text());
  const [first, second] = await Promise.all(retries.map((response) => response.json()));
  assert.equal(first.transaction.id, second.transaction.id);
  assert.notEqual(first.transaction.reference, data.transaction.reference);
  assert.equal((await resolveAttempt(data, "APPROVED")).status, 409);
  assert.equal((await resolveAttempt({ ...data, transaction: first.transaction }, "ERROR")).status, 200);
  assert.equal(await stock(), initial);
  const third = await (await retry(auth(), context(data))).json();
  assert.equal((await resolveAttempt({ ...data, transaction: third.transaction }, "APPROVED")).status, 200);
  assert.equal((await retry(auth(), context(data))).status, 409);
  assert.equal(await stock(), initial - 1);
});

test("4. Rechaza firmas y metadatos incorrectos", async () => {
  const data = await checkout();
  const event = await signed(data.transaction.id, "APPROVED");
  assert.equal((await webhook(request("POST", { ...event, signature: undefined }))).status, 401);
  assert.equal((await webhook(request("POST", { ...event, signature: { ...event.signature, checksum: "false" } }))).status, 401);
  assert.equal((await webhook(request("POST", event, undefined, { "X-Event-Checksum": "false" }))).status, 401);
  for (const transaction of [
    { reference: "otra" }, { currency: "USD" }, { amount_in_cents: "100" }, { status: "CANCELLED" },
  ]) {
    const altered = { transaction: { ...event.data.transaction, ...transaction } };
    const signature = { ...event.signature, checksum: checksum(altered, event.signature.properties, event.timestamp) };
    assert.equal((await webhook(request("POST", { ...event, data: altered, signature }))).status, 400);
  }
  for (const invalid of [{ event: "otra" }, { environment: "production" }]) {
    assert.equal((await webhook(request("POST", { ...event, ...invalid }))).status, 400);
  }
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: data.order.id } })).paymentStatus, "PENDING");
  assert.equal(await prisma.paymentEvent.count({ where: { transactionId: data.transaction.id } }), 0);
});

test("5. Propiedades dinámicas, timestamp del cuerpo y firma por header", async () => {
  const data = await checkout();
  const event = await signed(data.transaction.id, "PENDING");
  const properties = [...event.signature.properties].reverse();
  const timestamp = 1234567890;
  const header = checksum(event.data, properties, timestamp);
  const response = await webhook(request("POST", { ...event, timestamp, signature: { properties } }, undefined, { "X-Event-Checksum": header }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).signatureVerified, true);
});

test("6. Contraentrega únicamente en Cartagena, Bolívar", async () => {
  const data = await checkout({ city: " CARTAGÉNA ", department: " bolivar ", paymentMethod: "CONTRAENTREGA", deliveryMethod: "CONTRAENTREGA_LOCAL" });
  assert.equal(data.transaction, null);
  assert.equal(data.order.paymentStatus, "PENDING");
  assert.equal((await create(request("POST", {
    ...valid, checkoutIdempotencyKey: randomUUID(), city: "Turbaco", paymentMethod: "CONTRAENTREGA",
  }))).status, 400);
});

test("7. Valida datos, cantidades, puntos y cupones e ignora precios cliente", async () => {
  for (const invalid of [
    { address: "" }, { pointsRedeemed: 1 }, { couponCode: "CINEMERCH10-inventado" },
    { paymentMethod: "WOMPI_INVALID" }, { items: [{ id: "missing", quantity: 1 }] },
    { items: [{ id: product, quantity: 1.5 }] }, { items: [{ id: product, quantity: 0 }] },
    { items: [{ id: product, quantity: 51 }, { id: product, quantity: 50 }] },
  ]) {
    assert.equal((await create(request("POST", { ...valid, ...invalid, checkoutIdempotencyKey: randomUUID() }))).status, 400);
  }
  const data = await checkout({ couponCode: "CINEMERCH10-123", items: [{ id: product, quantity: 1, price: 1 }] });
  assert.equal(data.order.discount, 10000);
  assert.equal(JSON.parse(data.order.itemsJson)[0].price, 100000);
  await prisma.waitlistLead.update({ where: { couponCode: "CINEMERCH10-123" }, data: { isRedeemed: true } });
  assert.equal((await create(request("POST", { ...valid, checkoutIdempotencyKey: randomUUID(), couponCode: "CINEMERCH10-123" }))).status, 400);
});

test("8. Falta de stock revierte inventario, pago y evento", async () => {
  const data = await checkout({ items: [{ id: product, quantity: 1 }, { id: second, quantity: 1 }] });
  const storedItems = JSON.parse(data.order.itemsJson);
  const firstId = storedItems[0].productId;
  const lastId = storedItems[1].productId;
  const initial = await stock(firstId);
  await prisma.product.update({ where: { id: lastId }, data: { stock: 0 } });
  assert.equal((await resolveAttempt(data, "APPROVED")).status, 409);
  assert.equal(await stock(firstId), initial);
  assert.equal((await prisma.paymentTransaction.findUniqueOrThrow({ where: { id: data.transaction.id } })).status, "PENDING");
  assert.equal(await prisma.paymentEvent.count({ where: { transactionId: data.transaction.id } }), 0);
  assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: data.order.id } })).paymentStatus, "PENDING");
  await prisma.product.update({ where: { id: lastId }, data: { stock: 25 } });
});

test("9. Autorización de consulta, simulación, logística, catálogo y leads", async () => {
  const data = await checkout();
  const ctx = context(data);
  assert.equal((await status(request("GET"), ctx)).status, 404);
  assert.equal((await simulate(request("POST", { transactionId: data.transaction.id, scenario: "APPROVED" }))).status, 404);
  assert.equal((await patch(request("PATCH", { status: "ENVIADO" }), ctx)).status, 401);
  assert.equal((await patch(request("PATCH", { status: "PAGADO" }, admin), ctx)).status, 409);
  assert.equal((await patch(request("PATCH", { paymentStatus: "APPROVED" }, admin), ctx)).status, 400);
  assert.equal((await createProduct(request("POST", {}))).status, 401);
  assert.equal((await list(request("GET"))).status, 401);
  assert.deepEqual((await (await waitlist(request("GET"))).json()).leads, []);
  assert.equal((await (await waitlist(request("GET", undefined, admin))).json()).leads.length, 1);
  const response = await status(request("GET", undefined, data.paymentAccessToken), ctx);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const payload = await response.json();
  assert.equal(payload.paymentStatus, "PENDING");
  assert.equal(payload.customerName, undefined);
  assert.equal(payload.paymentAccessToken, undefined);
  assert.equal((await resolveAttempt(data, "APPROVED")).status, 200);
  assert.equal((await patch(request("PATCH", { status: "ENTREGADO" }, admin), ctx)).status, 409);
  assert.equal((await patch(request("PATCH", { status: "ENVIADO", trackingNumber: "DEMO" }, admin), ctx)).status, 200);
  assert.equal((await patch(request("PATCH", { status: "ENTREGADO" }, admin), ctx)).status, 200);
});

test("10. Modo desactivado y secreto ausente fallan de forma cerrada", async () => {
  const data = await checkout();
  const event = await signed(data.transaction.id, "APPROVED");
  const secret = process.env.MOCK_WOMPI_EVENT_SECRET!;
  try {
    process.env.PAYMENT_SIMULATION_ENABLED = "false";
    assert.equal((await resolveAttempt(data, "APPROVED")).status, 404);
    assert.equal((await webhook(request("POST", event))).status, 404);
    process.env.PAYMENT_SIMULATION_ENABLED = "true";
    delete process.env.MOCK_WOMPI_EVENT_SECRET;
    assert.equal((await webhook(request("POST", event))).status, 401);
    assert.equal((await resolveAttempt(data, "APPROVED")).status, 401);
    assert.equal((await prisma.order.findUniqueOrThrow({ where: { id: data.order.id } })).paymentStatus, "PENDING");
  } finally {
    process.env.PAYMENT_SIMULATION_ENABLED = "true";
    process.env.MOCK_WOMPI_EVENT_SECRET = secret;
  }
});

test("11. Accesorios usan el catálogo y seed conserva el stock", async () => {
  const id = "prod-protectores-steelbook";
  const data = await checkout({ items: [{ id, quantity: 1, price: 10 }, { id: "prod-claqueta-profesional", quantity: 1 }] });
  assert.equal(data.order.subtotal, 77000);
  assert.equal((await resolveAttempt(data, "APPROVED")).status, 200);
  await seedAccessories(prisma);
  assert.equal(await stock(id), 19);
});

test("12. Dos registros simultáneos con la misma clave crean una sola orden", async () => {
  const key = randomUUID();
  const [a, b] = await Promise.all([checkout({}, key), checkout({}, key)]);
  assert.equal(a.order.id, b.order.id);
  assert.equal(a.transaction.id, b.transaction.id);
  assert.equal(await prisma.order.count({ where: { checkoutIdempotencyKey: key } }), 1);
});
