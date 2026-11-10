"use client";

import React from "react";
import Link from "next/link";
import { Disc, Sparkles, ShieldCheck, Truck, Film, ArrowRight } from "lucide-react";
import {
  FilmReelDecoration,
  ClapperboardDecoration,
  FilmStripCurled,
  GoldenTicketDecoration,
} from "@/components/CinemaDecorations";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Top Red Hero Container - Faithful adaptation of the reference photo */}
      <div className="bg-gradient-to-b from-cine-900 via-cine-800 to-cine-900 text-white pt-16 pb-24 px-4 sm:px-8 lg:px-16 border-b border-cine-950/60 relative overflow-hidden">
        {/* Cinema Theme Floating Objects (Replacing the pretzels from the reference image) */}
        {/* Big 35mm Film Reel on the Top-Right (like the large pretzel in the photo) */}
        <div className="absolute -top-10 -right-12 sm:top-2 sm:-right-8 md:right-8 opacity-90 pointer-events-none z-0 transform hover:scale-105 transition-transform duration-700">
          <FilmReelDecoration size={240} rotation={25} />
        </div>

        {/* Director's Clapperboard on the Top-Left (like the pretzel on the top-left) */}
        <div className="absolute top-8 -left-12 sm:left-4 md:left-10 opacity-85 pointer-events-none z-0 transform -rotate-12">
          <ClapperboardDecoration size={170} rotation={-14} />
        </div>

        {/* Vintage Golden Ticket Floating at Mid-Right */}
        <div className="absolute top-48 right-12 hidden lg:block opacity-80 pointer-events-none z-0">
          <GoldenTicketDecoration size={135} rotation={16} />
        </div>

        {/* Curled Celluloid Film Strip at Mid-Left */}
        <div className="absolute top-52 left-10 hidden lg:block opacity-75 pointer-events-none z-0">
          <FilmStripCurled width={210} className="transform -rotate-6" />
        </div>

        {/* Subtle background cinema glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cine-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Sub-badge */}
          <div className="inline-flex items-center gap-2 bg-cine-950/80 border border-cine-600/80 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 mb-6 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tienda Especializada en Formato Físico 4K UHD & Steelbooks</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.08] max-w-4xl text-white drop-shadow-md">
            El Séptimo Arte en tus Manos,{" "}
            <span className="text-amber-300 italic font-serif">Entregado a tu Puerta</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-200 max-w-2xl font-light leading-relaxed drop-shadow">
            Steelbooks exclusivos en 4K Ultra HD, box sets de directores legendarios, réplicas oficiales y kits de colección. Curaduría técnica real para cinéfilos de Cartagena y toda Colombia.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="bg-amber-400 hover:bg-amber-300 text-cine-950 font-black px-7 py-3.5 rounded-full shadow-2xl hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-sm sm:text-base"
            >
              <Film className="w-4 h-4" />
              <span>Explorar Catálogo 4K</span>
            </Link>
            <Link
              href="/preventas"
              className="bg-cine-950/90 hover:bg-black text-white font-bold px-7 py-3.5 rounded-full border border-cine-600/80 transition-all flex items-center gap-2 text-sm sm:text-base hover:border-amber-400 shadow-xl"
            >
              <span>Ver Preventas de Estreno</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Floating visual showcase badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-zinc-200 w-full max-w-3xl">
            <div className="flex items-center justify-center gap-2 bg-cine-950/60 border border-cine-700/60 px-3 py-2.5 rounded-2xl backdrop-blur-md shadow">
              <Disc className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">4K Nativo & Dolby Atmos</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-cine-950/60 border border-cine-700/60 px-3 py-2.5 rounded-2xl backdrop-blur-md shadow">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">100% Producto Oficial</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-cine-950/60 border border-cine-700/60 px-3 py-2.5 rounded-2xl backdrop-blur-md shadow">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">Contraentrega Cartagena</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-cine-950/60 border border-cine-700/60 px-3 py-2.5 rounded-2xl backdrop-blur-md shadow">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">Empaque Blindado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cream Stats Bar - Direct match from the photo */}
      <div className="bg-parchment-50 border-b border-parchment-200 py-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-parchment-200 last:border-none">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-cine-900 tracking-tight">
              +1,500
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-600">
              Cinéfilos Registrados
            </p>
          </div>
          <div className="border-r border-parchment-200 last:border-none">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-cine-900 tracking-tight">
              99.2%
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-600">
              Reseñas 5 Estrellas
            </p>
          </div>
          <div className="border-r border-parchment-200 last:border-none">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-cine-900 tracking-tight">
              +2,400
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-600">
              Ediciones Entregadas
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-cine-900 tracking-tight">
              100%
            </div>
            <p className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-600">
              Región Libre & Garantía
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
