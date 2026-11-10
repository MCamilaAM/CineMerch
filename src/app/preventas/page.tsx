"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Calendar, ShieldCheck, ShoppingBag, Eye, Award } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductModal, { MovieProduct } from "@/components/ProductModal";
import CineImage from "@/components/CineImage";

export default function PreventasPage() {
  const { addToCart } = useCart();
  const [preorders, setPreorders] = useState<MovieProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MovieProduct | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 14,
    hours: 8,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    async function loadPreorders() {
      try {
        const res = await fetch("/api/products?isPreorder=true");
        const data = await res.json();
        if (data.success) {
          setPreorders(data.products);
        }
      } catch (e) {
        console.error("Error loading preorders", e);
      }
    }
    loadPreorders();

    // Live countdown timer ticker
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-10 px-4 sm:px-8 bg-parchment-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner with Live Countdown Clock */}
        <div className="bg-gradient-to-r from-cine-950 via-cine-900 to-cine-950 text-white rounded-4xl p-8 sm:p-12 border border-cine-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-cine-950 text-xs font-black uppercase px-3 py-1 rounded-full mb-4 shadow">
              <Sparkles className="w-4 h-4" />
              <span>Reserva Oficial Anticipada</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              Preventas Exclusivas de Estreno Físico
            </h1>

            <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
              Asegura tu tirada de coleccionista antes del agotamiento internacional. Financiamos importaciones directas de estudios cinematográficos garantizando que recibas tu copia numerada en Cartagena o cualquier ciudad del país.
            </p>

            {/* Countdown Clock Display */}
            <div className="mt-8 pt-6 border-t border-cine-800/80">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Cierre de Lote 1 de Preventas en:
              </span>

              <div className="flex items-center gap-3 font-mono">
                <div className="bg-cine-900/90 border border-cine-700/80 px-4 py-2.5 rounded-2xl text-center min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.days}</span>
                  <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Días</span>
                </div>
                <span className="text-2xl text-amber-400 font-bold">:</span>

                <div className="bg-cine-900/90 border border-cine-700/80 px-4 py-2.5 rounded-2xl text-center min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Horas</span>
                </div>
                <span className="text-2xl text-amber-400 font-bold">:</span>

                <div className="bg-cine-900/90 border border-cine-700/80 px-4 py-2.5 rounded-2xl text-center min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Min</span>
                </div>
                <span className="text-2xl text-amber-400 font-bold">:</span>

                <div className="bg-cine-900/90 border border-cine-700/80 px-4 py-2.5 rounded-2xl text-center min-w-[70px]">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Seg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-order Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {preorders.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-4xl p-6 border border-parchment-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row gap-6 items-stretch"
            >
              {/* Poster */}
              <div
                onClick={() => setSelectedProduct(prod)}
                className="sm:w-5/12 relative aspect-[3/4] rounded-2xl overflow-hidden bg-cine-950 shrink-0 cursor-pointer group"
              >
                <CineImage
                  src={prod.posterUrl}
                  alt={prod.title}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  fallbackTitle={prod.title}
                />
                <span className="absolute top-2 left-2 bg-amber-400 text-cine-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow z-10">
                  Preventa Activa
                </span>
                <span className="absolute bottom-2 right-2 bg-cine-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded z-10">
                  {prod.format}
                </span>
              </div>

              {/* Details */}
              <div className="sm:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-cine-700 font-semibold mb-1">
                    <span>{prod.director}</span>
                    <span>•</span>
                    <span>{prod.year}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(prod)}
                    className="font-serif font-black text-xl text-zinc-900 leading-tight hover:text-cine-700 cursor-pointer transition-colors"
                  >
                    {prod.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-600 font-light leading-relaxed line-clamp-3">
                    {prod.overview}
                  </p>

                  {/* Delivery date badge */}
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-[11px]">Fecha Estimada de Llegada:</strong>
                      <span className="font-medium text-[11px]">
                        {prod.preorderReleaseDate
                          ? new Date(prod.preorderReleaseDate).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Noviembre 2026"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-parchment-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Precio de Reserva</span>
                    <span className="text-xl font-serif font-black text-cine-900">
                      ${prod.price.toLocaleString("es-CO")} COP
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        id: prod.id,
                        title: prod.title,
                        price: prod.price,
                        format: prod.format,
                        category: prod.category,
                        posterUrl: prod.posterUrl,
                      })
                    }
                    className="bg-cine-700 hover:bg-cine-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Reservar Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees Box */}
        <div className="bg-white rounded-3xl p-6 border border-parchment-200 text-xs text-zinc-700 space-y-2">
          <h4 className="font-serif font-black text-sm text-cine-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Condiciones de Compra en Preventa
          </h4>
          <p>
            1. Cobro anticipado transparente: El monto pagado asegura tu cupón numerado de importación.
            <br />
            2. Notificación en cada hito: Recibirás updates cuando el embarque ingrese a aduanas y cuando la transportadora nacional (Coordinadora / Mensajería Local) asigne tu guía de rastreo.
            <br />
            3. Garantía 100% de devolución si la distribuidora cancela la tirada internacional.
          </p>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
