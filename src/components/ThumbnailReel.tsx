"use client";

import React from "react";
import Link from "next/link";
import CineImage from "@/components/CineImage";

export default function ThumbnailReel() {
  const items = [
    {
      title: "Oppenheimer",
      subtitle: "Steelbook 4K",
      img: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      href: "/catalogo?q=Oppenheimer",
    },
    {
      title: "Pulp Fiction",
      subtitle: "30° Aniversario",
      img: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      href: "/catalogo?q=Pulp",
    },
    {
      title: "Dune Parte 2",
      subtitle: "Glow in Dark",
      img: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      href: "/catalogo?q=Dune",
    },
    {
      title: "Interstellar",
      subtitle: "IMAX Edition",
      img: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      href: "/catalogo?q=Interstellar",
    },
    {
      title: "El Padrino",
      subtitle: "Kit 50 Años",
      img: "https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      href: "/kits",
    },
    {
      title: "Gladiator II",
      subtitle: "Preventa 4K",
      img: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      href: "/preventas",
    },
    {
      title: "Protectores PET",
      subtitle: "Pack 10 Unidades",
      img: "https://upload.wikimedia.org/wikipedia/commons/d/d4/HD-DVD_and_Blu-Ray_cases_%28crop%29.jpg",
      href: "/catalogo?format=Merch",
    },
    {
      title: "Claqueta de Cine",
      subtitle: "Madera y Acrílico",
      img: "https://images.unsplash.com/photo-1637248578458-934f03db3ea2?w=600&auto=format&fit=crop&q=80",
      href: "/catalogo?format=Merch",
    },
  ];

  return (
    <section className="py-8 bg-parchment-50 border-b border-parchment-200 overflow-hidden relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <p className="text-center text-xs font-serif italic text-zinc-500 mb-5">
          Joyas de coleccionismo cinematográfico disponibles en CineMerch
        </p>

        {/* Circular thumbnails strip - matching photo */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-3 scrollbar-none">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group flex flex-col items-center min-w-[85px] sm:min-w-[100px] text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-cine-700/60 p-0.5 group-hover:border-amber-400 group-hover:scale-110 transition-all duration-300 shadow-md bg-cine-950">
                <CineImage
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full rounded-full"
                  fallbackTitle={item.title}
                />
              </div>
              <span className="mt-2 text-[11px] font-bold text-zinc-800 group-hover:text-cine-800 transition-colors truncate max-w-[90px]">
                {item.title}
              </span>
              <span className="text-[9px] text-zinc-500 truncate max-w-[90px]">
                {item.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
