"use client";

import React from "react";
import Link from "next/link";
import { Film, ShieldCheck, Heart, Award, Disc } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-parchment-50 border-t border-parchment-200 text-zinc-800 pt-16 pb-12 px-4 sm:px-8 relative overflow-hidden z-10">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 text-xs sm:text-sm">
          <div>
            <h4 className="font-serif font-black text-cine-900 mb-3 text-sm">
              Sobre CineMerch
            </h4>
            <ul className="space-y-2 text-zinc-600 font-light">
              <li>
                <Link href="/#catalogo" className="hover:text-cine-800 transition-colors">
                  Nuestra Curaduría
                </Link>
              </li>
              <li>
                <Link href="/fidelizacion" className="hover:text-cine-800 transition-colors">
                  Club de Rangos (Extra a Director)
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">
                  U. de Cartagena · Ing. de Sistemas
                </span>
              </li>
              <li>
                <Link href="/admin" className="text-cine-700 font-bold hover:underline">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-black text-cine-900 mb-3 text-sm">
              Catálogo & Colección
            </h4>
            <ul className="space-y-2 text-zinc-600 font-light">
              <li>
                <Link href="/catalogo?format=Steelbook" className="hover:text-cine-800 transition-colors">
                  Steelbooks 4K Metálicos
                </Link>
              </li>
              <li>
                <Link href="/kits" className="hover:text-cine-800 transition-colors">
                  Kits Temáticos & Bundles
                </Link>
              </li>
              <li>
                <Link href="/preventas" className="hover:text-cine-800 transition-colors">
                  Preventas de Estreno
                </Link>
              </li>
              <li>
                <Link href="/catalogo?format=Merch" className="hover:text-cine-800 transition-colors">
                  Protectores & Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-black text-cine-900 mb-3 text-sm">
              Soporte & Envíos
            </h4>
            <ul className="space-y-2 text-zinc-600 font-light">
              <li>
                <Link href="/#faqs" className="hover:text-cine-800 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <span className="text-zinc-600">
                  Envío Gratis desde $150.000 COP
                </span>
              </li>
              <li>
                <span className="text-zinc-600">
                  Contraentrega en Cartagena y Bolívar
                </span>
              </li>
              <li>
                <span className="text-zinc-600">
                  Rastreo Coordinadora / Inter Rapidísimo
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-black text-cine-900 mb-3 text-sm">
              Síguenos en Redes
            </h4>
            <ul className="space-y-2 text-zinc-600 font-light">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-cine-800 transition-colors">
                  Instagram (@CineMerchCO)
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-cine-800 transition-colors">
                  TikTok (@CineMerchOficial)
                </a>
              </li>
              <li>
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-cine-800 transition-colors">
                  Canal de Preventas WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Bold Brand Logo - Matching the iconic photo element with cinema ornaments */}
        <div className="pt-8 pb-6 border-t border-parchment-200 text-center overflow-hidden relative">
          <div className="inline-flex items-center justify-center gap-3 relative">
            <span className="text-2xl sm:text-4xl text-amber-500/80">🎬</span>
            <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-black text-cine-900 tracking-tighter leading-none select-none hover:text-cine-800 transition-colors">
              CineMerch
            </h2>
            <span className="text-2xl sm:text-4xl text-amber-500/80">🎞️</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mt-2">
            Cartagena de Indias • Ediciones de Colección & Merch Oficial
          </p>
        </div>

        {/* Payment Badges & Legal info (Visa, Nequi, Bancolombia, Bre-B, Wompi, PSE) */}
        <div className="pt-6 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 CineMerch E-Commerce. Proyecto Universidad de Cartagena.</p>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-zinc-600">
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-cine-900 shadow-sm">WOMPI</span>
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-fuchsia-800 shadow-sm">NEQUI</span>
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-yellow-800 shadow-sm">BANCOLOMBIA</span>
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-emerald-800 shadow-sm">BRE-B</span>
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-blue-800 shadow-sm">PSE</span>
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-zinc-800 shadow-sm">VISA / MASTERCARD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
