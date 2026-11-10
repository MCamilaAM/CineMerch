"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Ticket, CheckCircle2, ArrowRight, ShieldCheck, Phone, Mail, User } from "lucide-react";
import { trackLeadCapture } from "@/lib/analytics";
import { useCart } from "@/context/CartContext";
import { FilmReelDecoration, GoldenTicketDecoration, ClapperboardDecoration } from "@/components/CinemaDecorations";

export default function WaitlistBanner() {
  const { applyCoupon } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [remainingSpots, setRemainingSpots] = useState<number>(18);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      try {
        const res = await fetch("/api/waitlist");
        const data = await res.json();
        if (data.success && data.remainingSpots !== undefined) {
          setRemainingSpots(data.remainingSpots);
        }
      } catch (e) {
        // Fallback default
      }
    }
    fetchSpots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone }),
      });
      const data = await res.json();

      if (data.success) {
        setCouponCode(data.couponCode);
        if (data.remainingSpots !== undefined) setRemainingSpots(data.remainingSpots);

        // Fire GA4 Event for Marketing / Conversion tracking (US-04)
        trackLeadCapture({
          email,
          campaign: "Primeros 100 Cinéfilos",
          coupon_code: data.couponCode,
        });

        // Trigger Confetti!
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#b91c1c", "#f59e0b", "#fbbf24", "#ffffff"],
        });

        // Auto-apply coupon to current session cart
        applyCoupon(data.couponCode);
      } else {
        setErrorMsg(data.error || "Ocurrió un error. Intenta nuevamente.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al registrar suscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-8 bg-parchment-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Deep Red Card matching the bottom banner of the reference image */}
        <div className="bg-gradient-to-r from-cine-950 via-cine-900 to-cine-950 rounded-4xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-cine-800">
          {/* Cinema Decorative Objects flanking the banner (matching pretzels from photo) */}
          <div className="absolute -bottom-10 -left-12 sm:bottom-2 sm:-left-6 opacity-85 pointer-events-none z-0 transform hover:scale-105 transition-transform duration-700">
            <FilmReelDecoration size={230} rotation={-15} />
          </div>

          <div className="absolute -top-8 -right-10 sm:top-2 sm:right-2 opacity-80 pointer-events-none z-0 transform rotate-12">
            <GoldenTicketDecoration size={150} rotation={22} />
          </div>

          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cine-700/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto sm:mx-0 sm:ml-36 md:ml-44">
            {/* Spot Counter Pill */}
            <div className="inline-flex items-center gap-2 bg-cine-800/80 border border-amber-400/50 px-3.5 py-1.5 rounded-full text-xs text-amber-300 font-bold mb-4 shadow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>¡Quedan solo {remainingSpots} cupos para los "Primeros 100 Cinéfilos"!</span>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Únete al Club & Recibe un{" "}
              <span className="text-amber-300 italic">10% de Descuento</span>
            </h3>

            <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
              Regístrate con tu correo y número de WhatsApp (Colombia +57) para desbloquear acceso anticipado a preventas exclusivas, kits de edición limitada y tu cupón de bienvenida.
            </p>

            {couponCode ? (
              <div className="mt-6 bg-cine-950/90 border border-emerald-500/60 p-5 rounded-2xl animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>¡Bienvenido a la hermandad cinéfila!</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  Tu cupón ya ha sido activado en tu carrito de compras:
                </p>
                <div className="mt-3 inline-flex items-center gap-3 bg-black/60 border border-amber-400/80 px-4 py-2 rounded-xl">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <span className="font-mono text-base font-bold text-amber-300 tracking-wider">
                    {couponCode}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  (Válido para tu primera compra de steelbooks, 4K UHD o kits temáticos).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Tu Nombre Completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cine-950/80 border border-cine-700 text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cine-950/80 border border-cine-700 text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder="WhatsApp (ej. 3001234567)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cine-950/80 border border-cine-700 text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-300 font-medium">{errorMsg}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-cine-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 disabled:opacity-50"
                  >
                    <span>{loading ? "Registrando..." : "Reclamar mi Bono del 10%"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Cero spam. Solo cinefilia pura y avisos de preventas.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
