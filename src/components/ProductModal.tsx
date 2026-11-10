"use client";

import React from "react";
import { X, Disc, Volume2, Globe, Film, Star, Calendar, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CineImage from "@/components/CineImage";

export interface MovieProduct {
  id: string;
  title: string;
  originalTitle?: string | null;
  tmdbId?: number | null;
  overview: string;
  price: number;
  format: string;
  category: string;
  director: string;
  cast?: string | null;
  studio?: string | null;
  year: number;
  posterUrl: string;
  backdropUrl?: string | null;
  stock: number;
  isPreorder?: boolean;
  preorderReleaseDate?: string | Date | null;
  isBundle?: boolean;
  bundleIncludes?: string | null;
  audioSpecs?: string | null;
  subtitleSpecs?: string | null;
  regionCode?: string | null;
  tmdbRating?: number | null;
}

interface ProductModalProps {
  product: MovieProduct | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 text-white border border-cine-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar Ficha Técnica"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Poster Image & Format Badges */}
        <div className="md:w-5/12 relative bg-cine-900/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-cine-800">
          <div className="relative w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl border border-cine-700/60 group">
            <CineImage
              src={product.posterUrl}
              alt={product.title}
              className="w-full h-auto"
              fallbackTitle={product.title}
            />
            {product.isPreorder && (
              <span className="absolute top-2 left-2 bg-amber-400 text-cine-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                Preventa
              </span>
            )}
            <span className="absolute bottom-2 right-2 bg-cine-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-cine-700">
              {product.format}
            </span>
          </div>

          <div className="mt-4 text-center">
            <span className="text-2xl font-serif font-black text-amber-400">
              ${product.price.toLocaleString("es-CO")} COP
            </span>
            <p className="text-[11px] text-zinc-400">IVA incluido | Envío gratis desde $150.000 COP</p>
          </div>
        </div>

        {/* Right: Technical Spec Sheet (US-07) */}
        <div className="md:w-7/12 p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <span>{product.year}</span>
              <span>•</span>
              <span>{product.director}</span>
              {product.tmdbRating && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {product.tmdbRating} / 10
                  </span>
                </>
              )}
            </div>
            <h3 className="text-2xl font-serif font-black text-white mt-1 leading-tight">
              {product.title}
            </h3>
            {product.originalTitle && product.originalTitle !== product.title && (
              <p className="text-xs text-zinc-400 italic">Título Original: {product.originalTitle}</p>
            )}
          </div>

          {/* Synopsis */}
          <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <p className="font-semibold text-zinc-200 mb-1">Sinopsis & Curaduría:</p>
            <p>{product.overview}</p>
          </div>

          {/* Bundle includes if applicable */}
          {product.bundleIncludes && (
            <div className="bg-cine-950/90 border border-amber-500/40 p-3 rounded-xl text-xs">
              <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <Film className="w-3.5 h-3.5" />
                El Kit Incluye:
              </p>
              <p className="text-zinc-200">{product.bundleIncludes}</p>
            </div>
          )}

          {/* Technical Specs Grid (US-07) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" /> Región de Disco
              </span>
              <span className="font-semibold text-zinc-100">{product.regionCode || "Región Libre 4K UHD"}</span>
            </div>

            <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" /> Pistas de Audio
              </span>
              <span className="font-semibold text-zinc-100 line-clamp-2">{product.audioSpecs || "Dolby Atmos / Dolby Digital"}</span>
            </div>

            <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Subtítulos Oficiales</span>
              <span className="font-semibold text-zinc-100">{product.subtitleSpecs || "Español Latino, Inglés SDH"}</span>
            </div>

            <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Estudio / Licencia</span>
              <span className="font-semibold text-zinc-100">{product.studio || "Estudio Oficial"}</span>
            </div>
          </div>

          {/* Cast */}
          {product.cast && (
            <div className="text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">Elenco Principal: </span>
              {product.cast}
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  format: product.format,
                  category: product.category,
                  posterUrl: product.posterUrl,
                });
                onClose();
              }}
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-cine-950 font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar al Carrito • ${product.price.toLocaleString("es-CO")} COP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
