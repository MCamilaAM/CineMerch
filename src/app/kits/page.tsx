"use client";

import React, { useState, useEffect } from "react";
import { Gift, Sparkles, CheckCircle2, ShoppingBag, Eye, Percent, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductModal, { MovieProduct } from "@/components/ProductModal";
import CineImage from "@/components/CineImage";

export default function KitsPage() {
  const { addToCart } = useCart();
  const [kits, setKits] = useState<MovieProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MovieProduct | null>(null);

  useEffect(() => {
    async function fetchKits() {
      try {
        const res = await fetch("/api/products?isBundle=true");
        const data = await res.json();
        if (data.success) {
          setKits(data.products);
        }
      } catch (e) {
        console.error("Error loading kits", e);
      }
    }
    fetchKits();
  }, []);

  return (
    <div className="py-10 px-4 sm:px-8 bg-parchment-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-br from-cine-950 via-cine-900 to-cine-950 text-white rounded-4xl p-8 sm:p-12 border border-cine-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-cine-950 text-xs font-black uppercase px-3 py-1 rounded-full mb-4 shadow">
              <Gift className="w-4 h-4" />
              <span>Bundles de Coleccionista</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              Kits Temáticos & Bundles de Película + Mercancía
            </h1>

            <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
              Adquiere colecciones integrales con un ahorro del 8% al 12% frente a la compra individual. Películas en 4K UHD acompañadas de litografías exclusivas, maquetas a escala y réplicas numeradas.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Kits Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="bg-white rounded-4xl p-6 border border-parchment-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Poster & Highlights */}
                <div
                  onClick={() => setSelectedProduct(kit)}
                  className="relative min-h-[230px] sm:aspect-video rounded-3xl overflow-hidden bg-cine-950 mb-5 cursor-pointer group flex flex-col justify-between p-4 gap-6"
                >
                  <CineImage
                    src={kit.posterUrl}
                    alt={kit.title}
                    className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
                    fallbackTitle={kit.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10 pointer-events-none"></div>

                  <span className="relative self-start bg-amber-400 text-cine-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow flex items-center gap-1.5 z-20">
                    <Percent className="w-3.5 h-3.5" />
                    Ahorro del 11%
                  </span>

                  <div className="relative text-white z-20">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                      {kit.director}
                    </span>
                    <h3 className="text-lg font-serif font-black leading-snug">{kit.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-light mb-4">
                  {kit.overview}
                </p>

                {/* Bundle Items Checklist */}
                {kit.bundleIncludes && (
                  <div className="bg-parchment-100 p-4 rounded-2xl border border-parchment-200 mb-6">
                    <span className="text-xs font-bold text-cine-900 block mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      ¿Qué incluye esta caja de colección?
                    </span>
                    <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                      {kit.bundleIncludes}
                    </p>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-parchment-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 line-through block">
                    Precio habitual: ${(kit.price * 1.12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP
                  </span>
                  <span className="text-2xl font-serif font-black text-cine-900">
                    ${kit.price.toLocaleString("es-CO")} COP
                  </span>
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      id: kit.id,
                      title: kit.title,
                      price: kit.price,
                      format: kit.format,
                      category: kit.category,
                      posterUrl: kit.posterUrl,
                    })
                  }
                  className="bg-amber-400 hover:bg-amber-300 text-cine-950 font-black text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adquirir Kit Completo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
