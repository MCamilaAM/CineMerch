"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, ShoppingBag, Menu, X, Sparkles, Award, ShieldCheck, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount, openCart, subtotal, userPoints, userTier } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification Ribbon */}
      <div className="bg-cine-950 text-amber-200 text-xs py-1.5 px-4 text-center font-medium border-b border-cine-800/60 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>
          <strong>Campaña Primeros 100 Cinéfilos:</strong> 10% OFF con código <code className="bg-cine-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">CINEMERCH10</code> | Envío Gratis desde $150.000 COP
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-cine-900 border-b border-cine-800 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-cine-700/80 border border-cine-500/50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
              Cine<span className="text-amber-400">Merch</span>
            </span>
            <span className="hidden sm:block text-[9px] tracking-widest uppercase text-cine-300 font-sans font-semibold">
              Ediciones de Colección & Merch
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-200">
          <Link href="/catalogo" className="hover:text-amber-300 transition-colors">
            Catálogo 4K & Steelbooks
          </Link>
          <Link href="/preventas" className="hover:text-amber-300 transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Preventas
          </Link>
          <Link href="/kits" className="hover:text-amber-300 transition-colors">
            Kits & Bundles
          </Link>
          <Link href="/fidelizacion" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Club de Rangos
          </Link>
          <Link href="/admin" className="text-xs bg-cine-950/70 border border-cine-700/80 px-2.5 py-1 rounded-md text-zinc-300 hover:text-white hover:border-amber-400 transition-all">
            Admin Panel
          </Link>
        </div>

        {/* Right Action Icons: Loyalty & Cart Drawer */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Tier pill */}
          <Link
            href="/fidelizacion"
            className="hidden sm:flex items-center gap-1.5 bg-cine-950/80 border border-cine-700/60 px-3 py-1.5 rounded-full text-xs text-amber-200 hover:border-amber-400 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{userTier.split(" ")[0]}</span>
            <span className="text-[10px] text-zinc-400 font-mono">({userPoints} pts)</span>
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-cine-700 hover:bg-cine-600 text-white px-3.5 py-2 rounded-xl shadow-lg transition-transform active:scale-95 border border-cine-500/40"
            aria-label="Abrir Carrito"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span className="hidden md:inline text-xs font-bold">
              ${subtotal.toLocaleString("es-CO")} COP
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-cine-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg bg-cine-800"
            aria-label="Abrir Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cine-950 border-b border-cine-800 px-6 py-4 space-y-3 text-sm text-zinc-200 animate-in slide-in-from-top-2">
          <Link
            href="/catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-300 border-b border-cine-900"
          >
            Catálogo 4K & Steelbooks
          </Link>
          <Link
            href="/preventas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-300 border-b border-cine-900"
          >
            Preventas Exclusivas
          </Link>
          <Link
            href="/kits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-300 border-b border-cine-900"
          >
            Kits & Bundles Temáticos
          </Link>
          <Link
            href="/fidelizacion"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-amber-300 border-b border-cine-900"
          >
            Club de Rangos Cinéfilos ({userPoints} pts)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-amber-300 hover:text-white"
          >
            Panel Administrativo & Métricas
          </Link>
        </div>
      )}
    </header>
  );
}
