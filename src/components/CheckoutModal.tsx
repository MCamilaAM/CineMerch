"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import confetti from "canvas-confetti";
import { X, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackPurchase, trackBeginCheckout } from "@/lib/analytics";
import { isLocalDelivery, paymentMethods } from "@/lib/checkout-options";
import SimulatedWompiGateway, { PaymentDetails, type PaymentAttempt } from "./SimulatedWompiGateway";

const activeKey = "cinemerch_active_payment";
const checkoutKey = "cinemerch_checkout_key";
const cities = {
  Cartagena: "Bolívar", Turbaco: "Bolívar", Barranquilla: "Atlántico",
  Bogotá: "Bogotá D.C.", Medellín: "Antioquia", Cali: "Valle del Cauca", Bucaramanga: "Santander",
};
const input = "w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400";
const button = "rounded-xl bg-amber-400 px-4 py-2 font-bold text-cine-950 disabled:opacity-50";

interface SavedPayment {
  order: {
    id: string; orderNumber: string; customerName: string; city: string; department: string; address: string;
    paymentMethod: keyof typeof paymentMethods; paymentStatus: string; status: string; paidAt: string | null;
    subtotal: number; discount: number; shippingCost: number; total: number;
    trackingNumber: string | null; itemsJson: string; createdAt: string;
  };
  paymentAccessToken: string;
  transaction: PaymentAttempt | null;
  coupon?: string | null;
}

interface StatusResponse {
  transaction: PaymentAttempt | null;
  paymentStatus: string;
  orderStatus: string;
  paidAt: string | null;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init).catch((error: unknown) => {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new Error("Error de conexión. Intenta nuevamente.");
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) throw new Error(data?.error || `Error del servidor (${response.status})`);
  return data;
}

function savePayment(payment: SavedPayment) {
  localStorage.setItem(activeKey, JSON.stringify(payment));
}

const money = (amount: number) => `$${amount.toLocaleString("es-CO")} COP`;

export default function CheckoutModal({ isOpen, recover, onClose }: {
  isOpen: boolean; recover: boolean; onClose: () => void;
}) {
  const { items, appliedCoupon, finalTotal, hasFreeShipping, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState({ customerName: "", customerEmail: "", customerPhone: "", city: "Cartagena", address: "" });
  const [method, setMethod] = useState<keyof typeof paymentMethods>("WOMPI_NEQUI");
  const [payment, setPayment] = useState<SavedPayment | null>(null);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);
  const poll = useRef<AbortController | null>(null);
  const department = cities[delivery.city as keyof typeof cities];
  const local = isLocalDelivery(delivery.city, department);
  const estimatedTotal = finalTotal + (hasFreeShipping ? 0 : local ? 8000 : 15000);
  const order = payment?.order;
  const transaction = payment?.transaction;
  const pollId = order?.id;
  const pollToken = payment?.paymentAccessToken;
  const pollState = order?.paymentStatus;
  const attemptId = transaction?.id;

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setStep(1);
    setVerified(false);
    setPayment(null);
    if (!recover) return;
    try {
      const saved: SavedPayment | null = JSON.parse(localStorage.getItem(activeKey) || "null");
      if (!saved?.order?.id || !saved.paymentAccessToken) throw new Error("No hay un pedido de prueba guardado.");
      setPayment(saved);
      setStep(4);
    } catch {
      setError("No hay un pedido de prueba guardado.");
    }
  }, [isOpen, recover]);

  useEffect(() => {
    if (!isOpen || !pollId || !pollToken || busy) return;
    const controller = new AbortController();
    poll.current = controller;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let queries = 0;

    async function refresh() {
      queries++;
      try {
        const result = await api<StatusResponse>(`/api/orders/${pollId}/payment-status`, {
          signal: controller.signal, cache: "no-store", headers: { Authorization: `Bearer ${pollToken}` },
        });
        if (controller.signal.aborted) return;
        setPayment((current) => current?.order.id === pollId && current ? {
          ...current, transaction: result.transaction,
          order: { ...current.order, paymentStatus: result.paymentStatus, status: result.orderStatus, paidAt: result.paidAt },
        } : current);
        setVerified(true);
        if (result.transaction && result.paymentStatus !== "PENDING") setStep(4);
        if (result.transaction && result.paymentStatus === "PENDING" && queries < 10) timeout = setTimeout(refresh, 4400);
      } catch (error) {
        if (!controller.signal.aborted) setError((error as Error).message);
      }
    }
    void refresh();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [isOpen, pollId, pollToken, pollState, attemptId, busy]);

  useEffect(() => {
    if (!payment) return;
    savePayment(payment);
    if (!verified || !isOpen || payment.order.paymentStatus !== "APPROVED" || payment.transaction?.status !== "APPROVED") return;
    const order = payment.order;
    const marker = `cinemerch_purchase_${order.id}`;
    if (localStorage.getItem(marker)) return;
    const purchased: { productId: string; title: string; price: number; quantity: number }[] = JSON.parse(order.itemsJson);
    localStorage.setItem(marker, "1");
    clearCart();
    trackPurchase({
      transaction_id: order.orderNumber, value: order.total, shipping: order.shippingCost,
      tax: Math.round(order.total * 19 / 119), coupon: payment.coupon || undefined, payment_type: order.paymentMethod,
      items: purchased.map(({ productId, title, price, quantity }) => ({ item_id: productId, item_name: title, price, quantity })),
    });
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  }, [payment, clearCart, isOpen, verified]);

  async function processAction(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    poll.current?.abort();
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function startPayment(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!items.length) {
      setError("Agrega un producto al carrito.");
      return;
    }
    trackBeginCheckout(items.map(({ id, title, price, quantity }) => ({ item_id: id, item_name: title, price, quantity })), estimatedTotal);
    setStep(2);
  }

  function createOrder() {
    void processAction(async () => {
      const checkoutIdempotencyKey = localStorage.getItem(checkoutKey) || crypto.randomUUID();
      localStorage.setItem(checkoutKey, checkoutIdempotencyKey);
      const result = await api<SavedPayment>("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...delivery, department, checkoutIdempotencyKey,
          paymentMethod: method, deliveryMethod: method === "CONTRAENTREGA" ? "CONTRAENTREGA_LOCAL" : "ENVIO_NACIONAL",
          items: items.map(({ id, quantity }) => ({ id, quantity })), couponCode: appliedCoupon, pointsRedeemed: 0,
        }),
      });
      const saved = { ...result, coupon: appliedCoupon };
      savePayment(saved);
      localStorage.removeItem(checkoutKey);
      setPayment(saved);
      setVerified(true);
      setStep(saved.transaction?.status === "PENDING" ? 3 : 4);
    });
  }

  function updateAttempt(scenario?: string) {
    if (!payment || !transaction) return;
    void processAction(async () => {
      const result = await api<{ transaction: PaymentAttempt }>(
        scenario ? "/api/wompi/simulate" : `/api/orders/${payment.order.id}/payment-attempt`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${payment.paymentAccessToken}` },
          body: scenario ? JSON.stringify({ transactionId: transaction.id, scenario }) : undefined,
        },
      );
      const status = result.transaction.status;
      const updated = {
        ...payment, transaction: result.transaction,
        order: { ...payment.order, paymentStatus: status, status: status === "APPROVED" ? "PAGADO" : "PENDIENTE" },
      };
      savePayment(updated);
      setPayment(updated);
      setVerified(true);
      setStep(scenario ? 4 : 3);
    });
  }

  if (!isOpen) return null;

  return (
    <div className="cinemerch-checkout fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md print:static print:p-0" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl border border-cine-800 bg-zinc-950 text-white shadow-2xl print:max-h-none print:max-w-none print:overflow-visible">
        <header className="flex items-center justify-between border-b border-cine-800 bg-cine-900 p-4 print:hidden">
          <div>
            <h3 id="checkout-title" className="flex items-center gap-2 font-serif text-lg font-black">
              <ShieldCheck className="h-5 w-5 text-amber-400" /> Checkout CineMerch
            </h3>
            <p className="text-xs text-zinc-300">Paso {step} de 4 · {["Entrega", "Método de pago", "Pasarela simulada", "Resultado"][step - 1]}</p>
          </div>
          <button aria-label="Cerrar checkout" onClick={onClose} className="rounded-full p-2 hover:bg-zinc-800"><X className="h-5 w-5" /></button>
        </header>

        <div className="space-y-4 p-4 sm:p-6">
          {error && <p role="alert" className="rounded-xl bg-rose-950 p-3 text-sm text-rose-200 print:hidden">{error}</p>}

          {step === 1 && !recover && (
            <form onSubmit={startPayment} className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  ["customerName", "Nombre completo", "text", 120],
                  ["customerEmail", "Correo electrónico", "email", 254],
                  ["customerPhone", "Teléfono", "tel", 30],
                  ["address", "Dirección y barrio", "text", 250],
                ] as const).map(([key, label, type, limit]) => (
                  <label key={key} className="grid gap-1">{label}
                    <input className={input} required type={type} maxLength={limit} value={delivery[key]}
                      onChange={(event) => setDelivery({ ...delivery, [key]: event.target.value })} />
                  </label>
                ))}
                <label className="grid gap-1">Ciudad
                  <select value={delivery.city} className={input} onChange={(event) => {
                    setDelivery({ ...delivery, city: event.target.value });
                    if (event.target.value !== "Cartagena" && method === "CONTRAENTREGA") setMethod("WOMPI_NEQUI");
                  }}>
                    {Object.entries(cities).map(([city, region]) => <option key={city} value={city}>{city} · {region}</option>)}
                  </select>
                </label>
              </div>
              {local && <p>Contraentrega disponible en Cartagena, Bolívar.</p>}
              <p className="text-zinc-400">El canje de puntos está desactivado porque el saldo no está verificado en el servidor.</p>
              <p>Total estimado <strong className="text-amber-300">{money(estimatedTotal)}</strong></p>
              <button className={button}>Elegir método de pago</button>
            </form>
          )}

          {step === 2 && (
            <section className="space-y-3">
              <h4 className="font-serif text-lg font-bold">Wompi — Simulación académica</h4>
              <p className="text-sm">Pago de prueba: no se realizará ningún cobro</p>
              <p className="text-sm text-zinc-400">Los métodos Wompi son demostrativos y funcionan sin conexión bancaria.</p>
              <fieldset className="grid grid-cols-2 gap-2" disabled={busy}>
                <legend className="mb-2 text-sm font-semibold">Método</legend>
                {Object.entries(paymentMethods).filter(([id]) => id !== "CONTRAENTREGA" || local).map(([id, label]) => (
                  <label key={id} className="flex gap-2 rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-sm">
                    <input type="radio" name="paymentMethod" checked={method === id}
                      onChange={() => setMethod(id as keyof typeof paymentMethods)} />{label}
                  </label>
                ))}
              </fieldset>
              <div className="flex flex-wrap gap-3">
                <button disabled={busy} onClick={() => setStep(1)} className="px-2 text-sm underline">Volver</button>
                <button disabled={busy} onClick={createOrder} className={button}>{busy ? "Registrando…" : "Registrar pedido"}</button>
              </div>
            </section>
          )}

          {order && (
            <section className="space-y-2 rounded-xl border border-zinc-700 p-3 text-sm">
              <h4 className="font-bold">Pedido <span className="break-all">{order.orderNumber}</span></h4>
              <dl className="space-y-1">
                {([["Subtotal", order.subtotal], ["Descuento", order.discount], ["Envío", order.shippingCost], ["Total", order.total]] as const)
                  .map(([label, amount]) => <div key={label} className="flex justify-between"><dt>{label}</dt><dd>{money(amount)}</dd></div>)}
              </dl>
            </section>
          )}

          {step === 3 && transaction && <SimulatedWompiGateway transaction={transaction} busy={busy} onScenario={updateAttempt} />}

          {step === 4 && order && !verified && !error && <p role="status">Consultando estado del pedido…</p>}
          {step === 4 && order && verified && (
            <section className="space-y-3">
              <h4 className="font-serif text-xl font-bold text-amber-300" aria-live="polite">
                {!transaction ? "Pedido registrado — pago pendiente a la entrega" :
                  order.paymentStatus === "APPROVED" ? "Pago de prueba aprobado" :
                  order.paymentStatus === "DECLINED" ? "Fondos insuficientes simulados" :
                  order.paymentStatus === "ERROR" ? "Error temporal simulado" : "En proceso"}
              </h4>
              {transaction && <PaymentDetails transaction={transaction} />}
              {!transaction && <p className="text-sm">{paymentMethods[order.paymentMethod]} · {order.paymentStatus} · {new Date(order.createdAt).toLocaleString("es-CO")}</p>}
              {order.paymentStatus === "APPROVED" && (
                <div className="space-y-1 rounded-xl border border-zinc-700 p-3 text-sm">
                  <h5 className="font-bold">Proforma de prueba — sin validez fiscal</h5>
                  <p>{order.customerName} · {order.address} · {order.city}, {order.department}</p>
                  {(JSON.parse(order.itemsJson) as { productId: string; title: string; quantity: number; price: number }[]).map((item) => (
                    <p key={item.productId}>{item.quantity} × {item.title} · {money(item.price * item.quantity)}</p>
                  ))}
                  <p>IVA incluido {money(Math.round(order.total * 19 / 119))}</p>
                  <p>Guía {order.trackingNumber || "Sin asignar"}</p>
                  {order.paidAt && <p>Fecha de aprobación {new Date(order.paidAt).toLocaleString("es-CO")}</p>}
                  <button className={button + " print:hidden"} onClick={() => window.print()}>Imprimir o guardar PDF</button>
                </div>
              )}
              {transaction && order.paymentStatus === "PENDING" &&
                <button disabled={busy} className={button} onClick={() => setStep(3)}>Volver a la pasarela</button>}
              {["DECLINED", "ERROR"].includes(order.paymentStatus) &&
                <button disabled={busy} className={button} onClick={() => updateAttempt()}>Nuevo intento</button>}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
