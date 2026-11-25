import type { Prisma } from "@prisma/client";
import { isLocalDelivery, paymentMethods, publicCoupons } from "./checkout-options";
import { objectBody, PaymentError } from "./payment-http";

export function readText(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new PaymentError(400, `${label} inválido`);
  }
  return value.trim();
}

export function parseCheckout(body: Record<string, unknown>) {
  const customerName = readText(body.customerName, "Nombre", 120);
  const customerEmail = readText(body.customerEmail, "Correo", 254).toLowerCase();
  const customerPhone = readText(body.customerPhone, "Teléfono", 30);
  const city = readText(body.city, "Ciudad", 100);
  const department = readText(body.department, "Departamento", 100);
  const address = readText(body.address, "Dirección", 250);
  const deliveryMethod = readText(body.deliveryMethod, "Entrega", 40);
  const paymentMethod = readText(body.paymentMethod, "Método de pago", 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
      !/^\+?[\d ()-]+$/.test(customerPhone) ||
      !/^\d{7,15}$/.test(customerPhone.replace(/\D/g, ""))) {
    throw new PaymentError(400, "Correo o teléfono inválido");
  }
  if (!Object.prototype.hasOwnProperty.call(paymentMethods, paymentMethod) ||
      !["ENVIO_NACIONAL", "CONTRAENTREGA_LOCAL"].includes(deliveryMethod)) {
    throw new PaymentError(400, "Método de pago o entrega inválido");
  }
  const local = isLocalDelivery(city, department);
  if (!local && (paymentMethod === "CONTRAENTREGA" || deliveryMethod === "CONTRAENTREGA_LOCAL")) {
    throw new PaymentError(400, "La contraentrega solo está disponible en Cartagena, Bolívar");
  }
  if (body.pointsRedeemed !== undefined && body.pointsRedeemed !== 0) {
    throw new PaymentError(400, "El canje de puntos está desactivado");
  }
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 100) {
    throw new PaymentError(400, "Carrito inválido");
  }

  const quantities = new Map<string, number>();
  for (const item of body.items) {
    const { id, quantity } = objectBody(item);
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id) ||
        typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new PaymentError(400, "Producto o cantidad inválidos");
    }
    const combined = (quantities.get(id) ?? 0) + quantity;
    if (combined > 100) throw new PaymentError(400, "Máximo 100 unidades por producto");
    quantities.set(id, combined);
  }

  const coupon = body.couponCode == null || body.couponCode === "" ? "" : readText(body.couponCode, "Cupón", 80).toUpperCase();
  return { customer: { customerName, customerEmail, customerPhone, city, department, address, deliveryMethod, paymentMethod }, local, quantities, coupon };
}

export async function priceOrder(db: Prisma.TransactionClient, { quantities, coupon, local }: ReturnType<typeof parseCheckout>) {
  const products = await db.product.findMany({ where: { id: { in: Array.from(quantities.keys()) } } });
  if (products.length !== quantities.size) throw new PaymentError(400, "Producto fuera del catálogo");
  const items = products.map(({ id, title, price, format, posterUrl, stock }) => {
    const quantity = quantities.get(id)!;
    if (!Number.isInteger(price) || price < 1) throw new PaymentError(400, "Precio de catálogo inválido");
    if (stock < quantity) throw new PaymentError(409, "Inventario insuficiente");
    return { productId: id, title, price, quantity, format, posterUrl };
  });
  if (coupon && !publicCoupons.includes(coupon) && !await db.waitlistLead.findFirst({
    where: { couponCode: coupon, isRedeemed: false },
  })) throw new PaymentError(400, "Cupón inválido o usado");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? Math.round(subtotal * 0.10) : 0;
  const shippingCost = subtotal >= 150000 ? 0 : local ? 8000 : 15000;
  const total = subtotal - discount + shippingCost;
  if (!Number.isSafeInteger(total) || total < 1 || subtotal > 2147483647 || total > 2147483647) {
    throw new PaymentError(400, "Importe fuera del rango admitido");
  }
  return { subtotal, discount, shippingCost, total, itemsJson: JSON.stringify(items) };
}
