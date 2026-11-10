"use client";

import React from "react";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Carlos E. Mendoza",
      city: "Cartagena, Bocagrande",
      badge: "Director VIP",
      text: "El Steelbook de Oppenheimer llegó en menos de 24 horas a Cartagena con pago contraentrega. El empaque de burbuja blindada cuidó las esquinas al 100%. Verlo en mi TV OLED con el disco 4K es una experiencia insuperable.",
      movie: "Oppenheimer 4K Steelbook",
    },
    {
      name: "Mariana Restrepo",
      city: "Medellín, El Poblado",
      badge: "Protagonista",
      text: "El efecto que brilla en la oscuridad del estuche de Dune Parte Dos es una obra de arte. Tenía dudas sobre los subtítulos en español y la ficha técnica de CineMerch fue 100% precisa. Ya acumulé 450 puntos en mi cuenta.",
      movie: "Dune Parte Dos Steelbook",
    },
    {
      name: "David Buelvas",
      city: "Barranquilla, Prado",
      badge: "Comprador Verificado",
      text: "Compré el kit de El Padrino 50 Aniversario como regalo para mi papá. La réplica de la flor de Vito Corleone y el libreto de rodaje superaron mis expectativas. Qué alegría tener una tienda de cine especializada en el Caribe.",
      movie: "Kit El Padrino 50 Años",
    },
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-8 bg-parchment-50 border-t border-parchment-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-100 px-3 py-1 rounded-full">
              Comunidad Cinéfila
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cine-900 tracking-tight mt-2">
              Lo que dicen los Coleccionistas
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            Testimonios verificados tras entrega física en Colombia
          </p>
        </div>

        {/* 3 Testimonial Cards matching reference photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-parchment-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-zinc-700 font-light leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Bottom Info with red quote mark matching reference photo */}
              <div className="mt-6 pt-4 border-t border-parchment-100 flex items-end justify-between">
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 leading-tight">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500">{rev.city}</p>
                  <span className="inline-block mt-1 bg-cine-50 text-cine-700 border border-cine-100 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {rev.badge} • {rev.movie}
                  </span>
                </div>

                {/* Big stylized quote mark from reference photo */}
                <span className="text-4xl font-serif font-black text-cine-700 leading-none select-none">
                  “
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
