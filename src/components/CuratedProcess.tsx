"use client";

import React from "react";
import { Disc, ShieldCheck, Box, Truck, Sparkles } from "lucide-react";
import { FilmReelDecoration, FilmStripCurled } from "@/components/CinemaDecorations";

export default function CuratedProcess() {
  const steps = [
    {
      num: "01",
      title: "Verificación de Master 4K & Región",
      desc: "Revisamos que cada disco cuente con transferencia de alta tasa de bits (bitrate), pistas de audio sin pérdida (Dolby Atmos / DTS-HD) y sea compatible en reproductores de Colombia y Latinoamérica (Región Libre o Región A).",
      icon: Disc,
    },
    {
      num: "02",
      title: "Empaque Blindado para Steelbooks",
      desc: "Sabemos el dolor de recibir un estuche metálico con abolladuras. Despachamos en cajas rígidas de alta resistencia con protectores en esquinas, doble capa de burbuja de aire y sellos de seguridad anti-manipulación.",
      icon: Box,
    },
    {
      num: "03",
      title: "Logística Confiable & Contraentrega",
      desc: "Despachos rápidos con guías oficiales de Coordinadora e Inter Rapidísimo a nivel nacional, y opción de pago contraentrega en efectivo o transferencia para Cartagena y municipios de Bolívar.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-parchment-100 border-t border-parchment-200 relative overflow-hidden">
      {/* Decorative Film Reels flanking the section header, matching the pretzels in the reference photo! */}
      <div className="absolute -top-12 -left-12 sm:left-4 md:left-8 opacity-80 pointer-events-none z-0">
        <FilmReelDecoration size={200} rotation={-20} />
      </div>

      <div className="absolute -top-12 -right-12 sm:right-4 md:right-8 opacity-80 pointer-events-none z-0">
        <FilmReelDecoration size={200} rotation={35} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-50 px-3 py-1 rounded-full mb-3 border border-cine-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-cine-600" />
            <span>Garantía de Autenticidad</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cine-900 tracking-tight leading-tight">
            La Curaduría CineMerch: El Estándar del Séptimo Arte
          </h2>
          <p className="mt-3 text-sm text-zinc-600 font-light leading-relaxed">
            Cada película y pieza de mercancía que sale de nuestro almacén cumple con un protocolo estricto diseñado por coleccionistas para coleccionistas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-parchment-200 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif font-black text-2xl text-amber-500/80">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-cine-50 border border-cine-100 flex items-center justify-center group-hover:bg-cine-700 group-hover:text-white transition-colors text-cine-700 shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif font-black text-lg text-cine-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-parchment-100 flex items-center gap-2 text-[11px] font-semibold text-cine-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Inspeccionado individualmente</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
