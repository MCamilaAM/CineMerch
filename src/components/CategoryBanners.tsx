"use client";

import React from "react";
import Link from "next/link";
import { Disc, Gift, Sparkles, Clapperboard, ArrowUpRight } from "lucide-react";
import CineImage from "@/components/CineImage";

export default function CategoryBanners() {
  const categories = [
    {
      title: "Ediciones 4K & Steelbooks",
      subtitle: "Estuches metálicos con relieve y transferencia nativa de master",
      icon: Disc,
      link: "/catalogo?format=Steelbook",
      bgGradient: "from-cine-900 to-cine-800",
      imageUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    },
    {
      title: "Kits Temáticos & Bundles",
      subtitle: "Película + libreto + accesorio coleccionable con 11% de ahorro",
      icon: Gift,
      link: "/kits",
      bgGradient: "from-cine-950 to-cine-900",
      badge: "Ahorra 11%",
      imageUrl: "https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    },
    {
      title: "Preventas de Estreno",
      subtitle: "Asegura ediciones limitadas antes de su agotamiento en cartelera",
      icon: Sparkles,
      link: "/preventas",
      bgGradient: "from-cine-900 to-cine-800",
      badge: "Cupos Limitados",
      imageUrl: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    },
    {
      title: "Merch Oficial & Accesorios",
      subtitle: "Protectores PET para steelbooks, claquetas y pósters metálicos",
      icon: Clapperboard,
      link: "/catalogo?format=Merch",
      bgGradient: "from-cine-950 to-cine-900",
      imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-8 bg-parchment-50 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.link}
                className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-cine-900 border border-cine-800/80 flex flex-col justify-between min-h-[300px]"
              >
                {/* Background Image using CineImage */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 opacity-40">
                  <CineImage
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full"
                    fallbackTitle={cat.title}
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.bgGradient} opacity-85 group-hover:opacity-75 transition-opacity`} />

                {/* Top Badge */}
                <div className="relative z-10 p-5 flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-cine-950/70 border border-cine-600/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-amber-400 group-hover:text-cine-950 transition-colors">
                    <Icon className="w-5 h-5 text-amber-300 group-hover:text-cine-950" />
                  </div>
                  {cat.badge && (
                    <span className="bg-amber-400 text-cine-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-5">
                  <h3 className="text-xl font-serif font-black text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-1 text-xs text-zinc-300 line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
