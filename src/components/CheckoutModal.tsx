"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Truck,
  CheckCircle2,
  Download,
  Share2,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackPurchase, trackBeginCheckout } from "@/lib/analytics";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    items,
    subtotal,
    discountAmount,
    appliedCoupon,
    pointsToRedeem,
    setPointsToRedeem,
    redeemedDiscountAmount,
    finalTotal,
    hasFreeShipping,
    clearCart,
    userPoints,
    userTier,
  } = useCart();

  // Step 1: Shipping Details, Step 2: Payment, Step 3: Success Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("Cartagena");
  const [department, setDepartment] = useState("Bolívar");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"CONTRAENTREGA_LOCAL" | "ENVIO_NACIONAL">("CONTRAENTREGA_LOCAL");
  const [paymentMethod, setPaymentMethod] = useState<string>("WOMPI_NEQUI");

  // Wompi simulated state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const isCartagena = city.toLowerCase().includes("cartagena") || department.toLowerCase().includes("bolívar");
  const shippingCost = hasFreeShipping ? 0 : isCartagena ? 8000 : 15000;
  const grandTotal = finalTotal + shippingCost;
  const ivaCalculado = Math.round(grandTotal * 0.19); // 19% IVA Colombia proforma desglose (US-14)

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !address) {
      alert("Por favor completa todos los datos de envío.");
      return;
    }

    // Trigger GA4 begin_checkout event
    trackBeginCheckout(
      items.map((i) => ({
        item_id: i.id,
        item_name: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      grandTotal
    );

    setStep(2);
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        city,
        department,
        address,
        deliveryMethod: isCartagena && paymentMethod === "CONTRAENTREGA" ? "CONTRAENTREGA_LOCAL" : "ENVIO_NACIONAL",
        paymentMethod,
        items,
        subtotal,
        discount: discountAmount + redeemedDiscountAmount,
        shippingCost,
        total: grandTotal,
        pointsRedeemed: pointsToRedeem,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        setStep(3);

        // GA4 Purchase Tracking (US-04)
        trackPurchase({
          transaction_id: data.order.orderNumber,
          value: grandTotal,
          shipping: shippingCost,
          tax: ivaCalculado,
          coupon: appliedCoupon || undefined,
          payment_type: paymentMethod,
          items: items.map((i) => ({
            item_id: i.id,
            item_name: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#b91c1c", "#f59e0b", "#10b981", "#ffffff"],
        });

        clearCart();
      } else {
        alert("Error al procesar la orden: " + (data.error || "Intenta nuevamente"));
      }
    } catch (err) {
      alert("Error de conexión con la pasarela.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 text-white rounded-3xl border border-cine-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-cine-950 via-cine-900 to-cine-950 border-b border-cine-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Checkout Seguro • CineMerch Colombia</span>
            </h3>
            <p className="text-[11px] text-zinc-300">
              {step === 1 && "Paso 1: Datos de Entrega & Dirección"}
              {step === 2 && "Paso 2: Pasarela de Pagos Wompi & Métodos Locales"}
              {step === 3 && "Paso 3: ¡Orden Confirmada & Factura Proforma!"}
            </p>
          </div>

          {step !== 3 && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: Shipping and Customer Information */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Correo Electrónico (Para Factura y Tracking) *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">WhatsApp / Teléfono Móvil *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Ciudad de Entrega *</label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (e.target.value === "Cartagena") {
                        setDepartment("Bolívar");
                        setPaymentMethod("CONTRAENTREGA");
                      } else {
                        setPaymentMethod("WOMPI_NEQUI");
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Cartagena">Cartagena (Bolívar) - Contraentrega Habilitada</option>
                    <option value="Turbaco">Turbaco / Arjona (Bolívar)</option>
                    <option value="Barranquilla">Barranquilla (Atlántico)</option>
                    <option value="Bogotá">Bogotá D.C.</option>
                    <option value="Medellín">Medellín (Antioquia)</option>
                    <option value="Cali">Cali (Valle del Cauca)</option>
                    <option value="Bucaramanga">Bucaramanga (Santander)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs font-semibold mb-1">Dirección Exacta & Barrio *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej. Bocagrande, Cra 3ra # 6-40, Apto 502"
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Cartagena Advantage Alert */}
              {isCartagena ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">¡Estás en la zona local de Cartagena y Bolívar!</span>
                    <p className="text-[11px] text-zinc-300">
                      Puedes pagar con Wompi o contraentrega al recibir el paquete con nuestro mensajero aliado en 24-48 horas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900/60 border border-zinc-700 p-3 rounded-xl text-xs text-zinc-300 flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Despacho Nacional con Coordinadora Mercantil</span>
                    <p className="text-[11px] text-zinc-400">
                      Tu paquete viajará asegurado con empaque blindado contra impactos.
                    </p>
                  </div>
                </div>
              )}

              {/* Loyalty points redemption slider (US-18) */}
              <div className="bg-cine-900/40 border border-cine-800 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Club Cinéfilo: Tienes {userPoints} puntos disponibles
                  </span>
                  <span className="text-[10px] text-zinc-400">10 pts = $100 COP</span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max={Math.min(userPoints, Math.floor((subtotal * 0.3) / 10))}
                    step="50"
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                    className="flex-1 accent-amber-400"
                  />
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {pointsToRedeem} pts (-${redeemedDiscountAmount.toLocaleString("es-CO")})
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Tope máximo permitido: hasta 30% del valor total de la orden.
                </p>
              </div>

              {/* Summary line */}
              <div className="bg-zinc-900 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total a pagar:</span>
                <span className="text-lg font-serif font-black text-amber-400">
                  ${grandTotal.toLocaleString("es-CO")} COP
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-cine-950 font-black py-3 rounded-xl transition-all shadow-lg text-sm"
              >
                Continuar a Selección de Pago
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method (Wompi + Bre-B + Nequi + Contraentrega) */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-sm text-zinc-200">
                Selecciona tu Método de Pago Preferido:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Wompi Nequi */}
                <label
                  onClick={() => setPaymentMethod("WOMPI_NEQUI")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "WOMPI_NEQUI"
                      ? "bg-fuchsia-950/40 border-fuchsia-500 text-white ring-1 ring-fuchsia-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-fuchsia-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Nequi (Push / QR Wompi)</div>
                    <div className="text-[10px] text-zinc-400">Notificación al celular al instante</div>
                  </div>
                </label>

                {/* Bre-B / Transfiya */}
                <label
                  onClick={() => setPaymentMethod("WOMPI_BRE_B")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "WOMPI_BRE_B"
                      ? "bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Interoperabilidad Bre-B / Llaves</div>
                    <div className="text-[10px] text-zinc-400">Transferencia inmediata Banco de la República</div>
                  </div>
                </label>

                {/* Botón Bancolombia */}
                <label
                  onClick={() => setPaymentMethod("WOMPI_BANCOLOMBIA")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "WOMPI_BANCOLOMBIA"
                      ? "bg-amber-950/40 border-amber-500 text-white ring-1 ring-amber-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Botón Bancolombia</div>
                    <div className="text-[10px] text-zinc-400">Débito directo sin intermediarios</div>
                  </div>
                </label>

                {/* Tarjetas / PSE */}
                <label
                  onClick={() => setPaymentMethod("WOMPI_CARD")}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === "WOMPI_CARD"
                      ? "bg-cine-900/60 border-cine-500 text-white ring-1 ring-cine-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-cine-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Tarjeta Débito / Crédito / PSE</div>
                    <div className="text-[10px] text-zinc-400">Visa, Mastercard, Amex con tokenización</div>
                  </div>
                </label>

                {/* Contraentrega Cartagena */}
                {isCartagena && (
                  <label
                    onClick={() => setPaymentMethod("CONTRAENTREGA")}
                    className={`sm:col-span-2 p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === "CONTRAENTREGA"
                        ? "bg-emerald-950/50 border-emerald-400 text-white ring-1 ring-emerald-400"
                        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-emerald-300">
                        Pago Contraentrega Local (Cartagena & Bolívar)
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Paga en efectivo o transferencia por Nequi/Bancolombia directo al recibir el paquete.
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {/* Order breakdown */}
              <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal películas & kits:</span>
                  <span>${subtotal.toLocaleString("es-CO")} COP</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento cupón ({appliedCoupon}):</span>
                    <span>-${discountAmount.toLocaleString("es-CO")} COP</span>
                  </div>
                )}
                {redeemedDiscountAmount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Descuento puntos ({pointsToRedeem} pts):</span>
                    <span>-${redeemedDiscountAmount.toLocaleString("es-CO")} COP</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Envío ({isCartagena ? "Cartagena Local" : "Nacional Coordinadora"}):</span>
                  <span>{shippingCost === 0 ? "¡GRATIS!" : `$${shippingCost.toLocaleString("es-CO")} COP`}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-sm text-white">
                  <span>Total Final:</span>
                  <span className="text-amber-400">${grandTotal.toLocaleString("es-CO")} COP</span>
                </div>
                <div className="text-[10px] text-zinc-400 text-right">
                  (Incluye IVA del 19%: ${ivaCalculado.toLocaleString("es-CO")} COP)
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold"
                >
                  Regresar
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCompleteOrder}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-cine-950 font-black py-3 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? "Procesando con Wompi..."
                      : `Confirmar Pedido • $${grandTotal.toLocaleString("es-CO")} COP`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Completed & Proforma Invoice (US-14) */}
          {step === 3 && completedOrder && (
            <div className="space-y-5 text-xs text-center sm:text-left animate-in zoom-in-95 duration-200">
              <div className="bg-emerald-950/50 border border-emerald-500/50 p-4 rounded-2xl flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">
                    ¡Orden #{completedOrder.orderNumber} Registrada con Éxito!
                  </h4>
                  <p className="text-[11px] text-zinc-300">
                    Hemos enviado los detalles a tu correo <strong className="text-white">{customerEmail}</strong> y WhatsApp.
                  </p>
                </div>
              </div>

              {/* Proforma Invoice Card (US-14) */}
              <div className="bg-white text-zinc-900 rounded-2xl p-5 shadow-inner border border-zinc-200 text-left font-sans">
                <div className="flex justify-between items-start border-b border-zinc-200 pb-3 mb-3">
                  <div>
                    <h5 className="font-serif font-black text-cine-900 text-base">CineMerch Colombia</h5>
                    <p className="text-[10px] text-zinc-500">Cartagena D.T. y C. • NIT: 901.884.231-1</p>
                    <p className="text-[10px] text-zinc-500">Factura Proforma & Comprobante Oficial</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs bg-cine-100 text-cine-800 px-2 py-0.5 rounded">
                      {completedOrder.orderNumber}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1">{new Date().toLocaleDateString("es-CO")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 text-zinc-600">
                  <div>
                    <strong className="text-zinc-900">Cliente:</strong> {completedOrder.customerName}
                    <br />
                    <strong className="text-zinc-900">Destino:</strong> {completedOrder.address}, {completedOrder.city}
                  </div>
                  <div className="text-right">
                    <strong className="text-zinc-900">Transportadora:</strong> {completedOrder.carrier}
                    <br />
                    <strong className="text-zinc-900">Guía de Rastreo:</strong>{" "}
                    <span className="font-mono text-cine-700 font-bold">{completedOrder.trackingNumber}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-b border-zinc-200 py-2 my-2 space-y-1 text-[11px]">
                  {JSON.parse(completedOrder.itemsJson).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.title} ({item.format})</span>
                      <span className="font-mono font-semibold">${(item.price * item.quantity).toLocaleString("es-CO")}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="text-right space-y-0.5 text-xs font-mono">
                  <div className="text-zinc-500">Subtotal: ${completedOrder.subtotal.toLocaleString("es-CO")} COP</div>
                  {completedOrder.discount > 0 && (
                    <div className="text-emerald-700">Descuento aplicado: -${completedOrder.discount.toLocaleString("es-CO")} COP</div>
                  )}
                  <div className="text-zinc-500">Envío: ${completedOrder.shippingCost.toLocaleString("es-CO")} COP</div>
                  <div className="text-zinc-400 text-[10px]">IVA (19% discriminado): ${ivaCalculado.toLocaleString("es-CO")} COP</div>
                  <div className="text-sm font-black text-cine-900 pt-1 border-t border-zinc-200">
                    Total Facturado: ${completedOrder.total.toLocaleString("es-CO")} COP
                  </div>
                </div>

                {/* Points Reward notice */}
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-[10px] text-amber-900 font-semibold">
                  🎉 ¡Ganaste {completedOrder.pointsEarned} Puntos Cinéfilos con esta compra para avanzar en tus Rangos!
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=573001234567&text=Hola%20CineMerch!%20Acabo%20de%20realizar%20la%20orden%20${completedOrder.orderNumber}%20para%20${completedOrder.city}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  Notificar por WhatsApp
                </a>

                <button
                  onClick={() => window.print()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Descargar Proforma
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-cine-950 font-black px-6 py-2.5 rounded-xl text-xs"
                >
                  Volver a la Tienda
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
