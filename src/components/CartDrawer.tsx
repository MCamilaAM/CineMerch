"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Sparkles,
  Ticket,
  ArrowRight,
  ShieldCheck,
  Disc,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/CheckoutModal";
import CineImage from "@/components/CineImage";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    itemCount,
    freeShippingThreshold,
    amountForFreeShipping,
    hasFreeShipping,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    addToCart,
    finalTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const [recoverCheckout, setRecoverCheckout] = useState(false);
  const [crossSellAccessories, setCrossSellAccessories] = useState<{
    id: string; title: string; price: number; format: string; category: string; posterUrl: string; stock: number;
  }[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    setCrossSellAccessories([]);
    fetch("/api/products?category=Accesorios", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!controller.signal.aborted && data?.success) setCrossSellAccessories(data.products.filter(
          (product: { id: string; stock: number }) => product.stock > 0 &&
            ["prod-protectores-steelbook", "prod-claqueta-profesional"].includes(product.id),
        ));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [isOpen]);

  // Percentage towards free shipping
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <div className="relative w-full max-w-md bg-white text-zinc-900 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-4 bg-cine-900 text-white flex items-center justify-between border-b border-cine-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h3 className="font-serif font-black text-lg">Tu Carrito Cinéfilo</h3>
              <span className="bg-cine-950 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-cine-950 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Cerrar Carrito"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Free Shipping Progress Bar (US-10) */}
          <div className="p-3.5 bg-parchment-100 border-b border-parchment-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-800">
                <Truck className="w-4 h-4 text-cine-700" />
                {hasFreeShipping ? (
                  <strong className="text-emerald-700 font-bold">
                    ¡Felicitaciones! Tienes Envío GRATIS 🎉
                  </strong>
                ) : (
                  <span>
                    Te faltan{" "}
                    <strong className="text-cine-800 font-bold">
                      ${amountForFreeShipping.toLocaleString("es-CO")} COP
                    </strong>{" "}
                    para Envío Gratis
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-zinc-600">{progressPercent}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-parchment-300 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  hasFreeShipping ? "bg-emerald-500" : "bg-cine-700"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <div className="w-16 h-16 rounded-full bg-parchment-100 flex items-center justify-center mb-3">
                  <Disc className="w-8 h-8 text-cine-700" />
                </div>
                <h4 className="font-serif font-black text-zinc-800 text-lg">Tu carrito está vacío</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Explora nuestros steelbooks 4K nativos, kits temáticos y figuras oficiales para llenar tu colección.
                </p>
                {/* Working link button redirecting to /catalogo */}
                <Link
                  href="/catalogo"
                  onClick={closeCart}
                  className="mt-4 bg-cine-700 hover:bg-cine-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-1.5 shadow"
                >
                  <Disc className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ver Catálogo de Películas</span>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-parchment-50 p-2.5 rounded-2xl border border-parchment-200 shadow-sm"
                >
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-cine-950 shrink-0">
                    <CineImage
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full"
                      fallbackTitle={item.title}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-zinc-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 p-0.5"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="inline-block text-[10px] text-cine-700 font-semibold bg-cine-100 px-1.5 py-0.5 rounded mt-0.5">
                        {item.format}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-parchment-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-zinc-600 hover:text-cine-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-zinc-600 hover:text-cine-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-black text-sm text-zinc-900">
                        ${(item.price * item.quantity).toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* 1-Click Cross-Selling Suggestions (US-11) */}
            {items.length > 0 && crossSellAccessories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-parchment-200">
                <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Completa tu pedido (Venta Cruzada):
                </span>

                <div className="space-y-2">
                  {crossSellAccessories.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-parchment-100 border border-parchment-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <CineImage
                            src={acc.posterUrl}
                            alt={acc.title}
                            className="w-full h-full"
                            fallbackTitle={acc.title}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-800 text-[11px]">{acc.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            ${acc.price.toLocaleString("es-CO")} COP
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(acc)}
                        className="bg-cine-700 hover:bg-cine-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-parchment-50 border-t border-parchment-200 space-y-3">
              {/* Coupon Input */}
              <div className="flex items-center gap-2">
                {appliedCoupon ? (
                  <div className="flex-1 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between font-mono">
                    <span>Cupón: {appliedCoupon} (-10%)</span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-700 font-bold hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Código Cupón (ej. CINEMERCH10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-parchment-300 rounded-xl text-xs focus:outline-none focus:border-cine-700 uppercase font-mono"
                    />
                    <button
                      onClick={() => {
                        applyCoupon(couponInput);
                        setCouponInput("");
                      }}
                      className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-xl font-bold"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>

              {/* Subtotal & Totals */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">${subtotal.toLocaleString("es-CO")} COP</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento de Bienvenida:</span>
                    <span className="font-mono">-${discountAmount.toLocaleString("es-CO")} COP</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Envío:</span>
                  <span>{hasFreeShipping ? "¡GRATIS!" : "Calculado al ordenar"}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-black text-cine-900 pt-1 border-t border-parchment-200">
                  <span>Total Estimado:</span>
                  <span className="font-mono">${finalTotal.toLocaleString("es-CO")} COP</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setRecoverCheckout(false);
                  closeCart();
                  setCheckoutModalOpen(true);
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-cine-950 font-black py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                <span>Proceder al Pago (Wompi / Contraentrega)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulación académica sin cobros reales</span>
              </div>
            </div>
          )}
          <button type="button" className="border-t border-parchment-200 p-3 text-xs font-bold text-cine-800 underline"
            onClick={() => {
              setRecoverCheckout(true);
              closeCart();
              setCheckoutModalOpen(true);
            }}>
            Consultar último pedido de prueba guardado
          </button>
        </div>
      </div>}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        recover={recoverCheckout}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </>
  );
}
