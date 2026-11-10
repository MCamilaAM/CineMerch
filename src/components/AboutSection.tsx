"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Film, Award, Heart, CheckCircle2 } from "lucide-react";
import CineImage from "@/components/CineImage";

export default function AboutSection() {
  return (
    <section className="relative z-10 py-16 px-4 sm:px-8 bg-parchment-50 border-t border-parchment-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Story & Philosophy - Matching "Ozzie & the team" layout */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-100/80 px-3 py-1 rounded-full">
            <GraduationCap className="w-4 h-4 text-cine-700" />
            <span>Universidad de Cartagena · Comercio Electrónico</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cine-900 tracking-tight leading-tight">
            CineMerch & el Equipo de Curaduría
          </h2>

          <p className="text-zinc-700 leading-relaxed text-sm sm:text-base font-light">
            En un mundo dominado por catálogos efímeros de streaming y compresión digital, CineMerch nació en Cartagena como una respuesta para los verdaderos amantes del séptimo arte. Desarrollado por estudiantes de Ingeniería de Sistemas bajo la metodología SCRUM y un plan de marketing riguroso para el Caribe colombiano.
          </p>

          <p className="text-zinc-700 leading-relaxed text-sm sm:text-base font-light">
            No somos un marketplace impersonal: cada película, steelbook o kit temático es revisado en su master nativo 4K, relación de aspecto, pistas de audio sin compresión (Dolby Atmos / DTS-HD) y embalado con protección blindada anti-impactos para que tu colección llegue impoluta.
          </p>

          {/* Key pillars checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cine-600 shrink-0" />
              <span>Verificación de Región A y 4K Libre</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cine-600 shrink-0" />
              <span>Metadatos enriquecidos con TMDB</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cine-600 shrink-0" />
              <span>Pagos locales Wompi & Contraentrega</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cine-600 shrink-0" />
              <span>Programa de Rangos: Extra a Director</span>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/fidelizacion"
              className="inline-flex items-center gap-2 bg-cine-900 hover:bg-cine-800 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all text-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Descubrir el Programa de Fidelización
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        <div className="lg:col-span-5 relative sm:pb-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cine-950">
            <CineImage
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"
              alt="CineMerch Sala y Colección de Cine"
              className="w-full h-[380px] sm:h-[400px] hover:scale-105 transition-transform duration-700"
              fallbackTitle="Sala CineMerch Cartagena"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cine-950 via-cine-950/35 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-5 sm:bottom-20 left-5 right-5 text-white z-10">
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-bold">
                Cartagena de Indias, D.T. y C.
              </span>
              <h4 className="text-lg font-serif font-bold leading-snug">
                Pasión cinematográfica, rigor técnico y entrega garantizada.
              </h4>
            </div>
          </div>

          {/* Floating badge */}
          <div className="relative sm:absolute sm:-bottom-2 sm:-left-4 z-20 mt-3 sm:mt-0 w-fit bg-amber-400 text-cine-950 p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white">
            <Film className="w-6 h-6 text-cine-900 shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight">Curaduría 100% Cinéfila</p>
              <p className="text-[11px] font-medium text-cine-900/80">Por y para coleccionistas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
