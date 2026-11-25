"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Las películas 4K Ultra HD y Blu-ray son compatibles en Colombia?",
      a: "¡Totalmente! Todos los discos 4K Ultra HD del mundo son libres de región (Region Free) por norma técnica de la UHD Alliance. Para los discos Blu-ray estándar o de material extra, verificamos que correspondan a la Región A (la región oficial de Colombia, Norteamérica y Latinoamérica), por lo que reproducirán sin ningún problema en tu consola PlayStation 5, Xbox Series X o reproductor dedicado.",
    },
    {
      q: "¿Qué medios de pago admiten? ¿Puedo pagar contraentrega en Cartagena?",
      a: "Wompi es una simulación académica sin conexión bancaria ni cobros. Puedes probar tarjeta, Nequi, PSE, Bancolombia y Bre-B. La opción de contraentrega solo está disponible en Cartagena, Bolívar.",
    },
    {
      q: "¿Cómo funciona el beneficio de envío gratis y los tiempos de entrega?",
      a: "El envío es 100% GRATIS a cualquier municipio de Colombia en compras a partir de $150.000 COP. Para pedidos locales en Cartagena el tiempo de entrega estimado es de 24 a 48 horas hábiles. Para el resto del país enviamos vía Coordinadora Mercantil o Inter Rapidísimo con número de guía oficial y notificación por correo/WhatsApp.",
    },
    {
      q: "¿Cómo funciona el programa de rangos y fidelización de CineMerch?",
      a: "Cada vez que compras, acumulas 1 punto por cada $1.000 COP consumidos. Tu cuenta evoluciona a través de 4 rangos cinéfilos: Extra (0-500 pts), Reparto (501-1500 pts), Protagonista (1501-3000 pts) y Director (+3000 pts). Podrás redimir tus puntos acumulados como descuento en el checkout de tus siguientes compras (hasta un 30% del total de la orden) y desbloquear preventas anticipadas.",
    },
    {
      q: "¿Cómo protegen los Steelbooks durante el transporte para evitar rayones?",
      a: "Entendemos lo delicado del coleccionismo metálico. Cada steelbook es inspeccionado antes de ser sellado, protegido en film termocontraíble o funda PET, cubierto con doble burbuja de alta densidad y embalado en una caja rígida protectora diseñada contra caídas y aplastamientos.",
    },
  ];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-8 bg-parchment-50 border-t border-parchment-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-100 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Resolviendo tus dudas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cine-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 font-light max-w-lg mx-auto">
            Desde compatibilidad de discos hasta métodos de pago y tiempos de entrega en Cartagena y Colombia.
          </p>
        </div>

        {/* Accordion matching the photo layout */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-parchment-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-zinc-900 hover:text-cine-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? "bg-cine-800 text-white" : "bg-parchment-100 text-zinc-600"
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed border-t border-parchment-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
