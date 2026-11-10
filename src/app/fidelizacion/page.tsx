"use client";

import React, { useState } from "react";
import { Award, Star, Sparkles, ShieldCheck, CheckCircle2, Gift, ArrowRight, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function FidelizacionPage() {
  const { userPoints, userTier } = useCart();
  const [simulatedPurchase, setSimulatedPurchase] = useState<number>(200000);

  const tiers = [
    {
      name: "Extra",
      level: 1,
      minPoints: 0,
      maxPoints: 500,
      color: "from-zinc-700 to-zinc-900",
      accent: "text-zinc-300",
      border: "border-zinc-700",
      badge: "Iniciación Cinéfila",
      perks: [
        "1 Punto acumulado por cada $1.000 COP consumidos",
        "Boletín mensual con recomendaciones de cartelera",
        "Garantía oficial en todas las ediciones físicas",
      ],
    },
    {
      name: "Reparto",
      level: 2,
      minPoints: 501,
      maxPoints: 1500,
      color: "from-amber-900 to-cine-900",
      accent: "text-amber-400",
      border: "border-amber-600/60",
      badge: "Coleccionista Habitual",
      perks: [
        "Todo lo del nivel Extra",
        "5% de descuento en protectores y accesorios PET",
        "Empaque reforzado de burbuja blindada sin costo extra",
        "Acceso a ofertas especiales de aniversario",
      ],
    },
    {
      name: "Protagonista",
      level: 3,
      minPoints: 1501,
      maxPoints: 3000,
      color: "from-cine-900 to-rose-950",
      accent: "text-rose-400",
      border: "border-rose-500/60",
      badge: "Voz en el Séptimo Arte",
      perks: [
        "Todo lo del nivel Reparto",
        "Acceso anticipado de 24 horas a Preventas de estreno",
        "8% de descuento adicional en Kits Temáticos y Bundles",
        "Insignia exclusiva de 'Protagonista' en tus reseñas verificadas",
      ],
    },
    {
      name: "Director",
      level: 4,
      minPoints: 3001,
      maxPoints: 99999,
      color: "from-amber-600 via-amber-700 to-cine-950",
      accent: "text-amber-300",
      border: "border-amber-400",
      badge: "Máximo Rango Cinéfilo",
      perks: [
        "Todo lo de niveles anteriores",
        "Acceso anticipado prioritario de 48 horas a tiradas ultra limitadas",
        "Envío prioritario express gratis sin monto mínimo",
        "Atención personalizada directa por WhatsApp con el equipo de curaduría",
        "Regalo de colección exclusivo en tu cumpleaños",
      ],
    },
  ];

  // Calculate next tier target
  let nextTier = tiers[1];
  let pointsToNext = Math.max(0, 501 - userPoints);
  let progressInCurrentTier = Math.min(100, Math.round((userPoints / 500) * 100));

  if (userPoints > 3000) {
    nextTier = tiers[3];
    pointsToNext = 0;
    progressInCurrentTier = 100;
  } else if (userPoints > 1500) {
    nextTier = tiers[3];
    pointsToNext = Math.max(0, 3001 - userPoints);
    progressInCurrentTier = Math.min(100, Math.round(((userPoints - 1500) / 1500) * 100));
  } else if (userPoints > 500) {
    nextTier = tiers[2];
    pointsToNext = Math.max(0, 1501 - userPoints);
    progressInCurrentTier = Math.min(100, Math.round(((userPoints - 500) / 1000) * 100));
  }

  const simulatedPointsEarned = Math.floor(simulatedPurchase / 1000);
  const simulatedSavings = Math.round(simulatedPointsEarned * 10);

  return (
    <div className="py-10 px-4 sm:px-8 bg-parchment-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-cine-950 via-cine-900 to-cine-950 text-white rounded-4xl p-8 sm:p-12 border border-cine-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-cine-950 text-xs font-black uppercase px-3 py-1 rounded-full mb-4 shadow">
              <Award className="w-4 h-4" />
              <span>Programa de Fidelización Cinéfilo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              De Extra a Director: Tu Pasión Tiene Recompensa
            </h1>

            <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
              Diseñado según el plan de marketing de CineMerch para fomentar la retención y premiar a los coleccionistas del Caribe colombiano. Acumula puntos con cada compra y desbloquea beneficios exclusivos.
            </p>
          </div>
        </div>

        {/* User Current Tier Status Card (US-17) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-parchment-200 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-parchment-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Tu Rango Cinéfilo Actual:
              </span>
              <h2 className="text-3xl font-serif font-black text-cine-900 flex items-center gap-3 mt-1">
                <Award className="w-8 h-8 text-amber-500" />
                <span>{userTier}</span>
              </h2>
              <p className="text-xs text-zinc-600 mt-1">
                Saldo acumulado: <strong className="text-cine-800 font-mono text-sm">{userPoints} Puntos</strong>
              </p>
            </div>

            <div className="bg-parchment-100 p-4 rounded-2xl border border-parchment-200 md:text-right">
              <span className="text-xs text-zinc-500 block">Siguiente Rango a Alcanzar:</span>
              <strong className="text-lg font-serif font-bold text-zinc-900">{nextTier.name}</strong>
              <p className="text-xs text-cine-700 font-medium mt-0.5">
                {pointsToNext > 0 ? `Te faltan ${pointsToNext} puntos` : "¡Has alcanzado el rango máximo!"}
              </p>
            </div>
          </div>

          {/* Progress bar towards next tier */}
          <div className="pt-6">
            <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-2">
              <span>Progreso de Nivel</span>
              <span>{progressInCurrentTier}%</span>
            </div>
            <div className="w-full bg-parchment-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-cine-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressInCurrentTier}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 4 Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.level}
              className={`bg-gradient-to-b ${tier.color} text-white rounded-3xl p-6 border ${tier.border} shadow-xl flex flex-col justify-between relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-black tracking-widest bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                    Nivel {tier.level}
                  </span>
                  <span className={`text-xs font-mono font-bold ${tier.accent}`}>
                    {tier.minPoints}+ pts
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-black mb-1">{tier.name}</h3>
                <p className="text-xs text-zinc-300 font-medium mb-4">{tier.badge}</p>

                <ul className="space-y-2 text-xs text-zinc-200">
                  {tier.perks.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.accent}`} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <span className="text-[11px] text-zinc-300">
                  {tier.minPoints === 0 ? "Comienza con tu primera compra" : `Desbloquea con $${(tier.minPoints * 1000).toLocaleString("es-CO")} COP consumidos`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Points Calculator Interactive Widget */}
        <div className="bg-white rounded-4xl p-8 border border-parchment-200 shadow-sm">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-100 px-3 py-1 rounded-full">
              Simulador de Recompensas
            </span>
            <h3 className="text-2xl font-serif font-black text-cine-900 mt-2">
              Calcula tus Puntos y Ahorro Futuro
            </h3>
            <p className="text-xs text-zinc-600 mt-1 mb-6">
              Mueve el selector para simular el valor de tu orden y ver cuántos puntos acumularás:
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-800 mb-2">
                  <span>Monto de la Orden:</span>
                  <span className="font-mono text-cine-800 text-sm">
                    ${simulatedPurchase.toLocaleString("es-CO")} COP
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="600000"
                  step="25000"
                  value={simulatedPurchase}
                  onChange={(e) => setSimulatedPurchase(Number(e.target.value))}
                  className="w-full accent-cine-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-parchment-100 p-4 rounded-2xl border border-parchment-200">
                <div>
                  <span className="text-[11px] text-zinc-500 block">Puntos a Ganar:</span>
                  <span className="text-xl font-mono font-black text-cine-800">
                    +{simulatedPointsEarned} pts
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block">Valor en Descuento:</span>
                  <span className="text-xl font-mono font-black text-emerald-700">
                    ${simulatedSavings.toLocaleString("es-CO")} COP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
