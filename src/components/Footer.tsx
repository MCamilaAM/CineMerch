"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Film, ShieldCheck, Heart, Award, Disc } from "lucide-react";

const channels = [
  { label: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL, hosts: ["instagram.com", "www.instagram.com"] },
  { label: "TikTok", url: process.env.NEXT_PUBLIC_TIKTOK_URL, hosts: ["tiktok.com", "www.tiktok.com"] },
  { label: "WhatsApp", url: process.env.NEXT_PUBLIC_WHATSAPP_URL, hosts: ["whatsapp.com", "www.whatsapp.com", "wa.me", "chat.whatsapp.com"] },
].flatMap(({ label, url, hosts }) => {
  if (!url) return [];
  try {
    const target = new URL(url);
    return target.protocol === "https:" && hosts.includes(target.hostname) && target.pathname !== "/"
      ? [{ label, href: target.href }] : [];
  } catch {
    return [];
  }
});

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
                  Contraentrega en Cartagena, Bolívar
                </span>
              </li>
              <li>
                <span className="text-zinc-600">
                  Rastreo Coordinadora / <a href="https://interrapidisimo.com/" className="hover:underline">Inter Rapidísimo</a>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-black text-cine-900">Información de la tienda</h4>
            <ul className="space-y-2 text-zinc-600">
              <li><Link className="hover:underline" href="/privacidad">Política de datos y analítica</Link></li>
              <li><Link className="hover:underline" href="/condiciones">Condiciones de compra de prueba</Link></li>
              <li><a className="hover:underline" href="https://sedeelectronica.sic.gov.co/">Protección al consumidor · SIC</a></li>
            </ul>
            {channels.length > 0 && (
              <ul className="mt-3 space-y-2 text-zinc-600" aria-label="Canales de CineMerch">
                {channels.map(({ label, href }) => <li key={label}><a className="hover:underline" href={href} target="_blank" rel="noreferrer">{label}</a></li>)}
              </ul>
            )}
          </div>
        </div>

        {/* Giant Bold Brand Logo - Matching the iconic photo element with cinema ornaments */}
        <div className="pt-8 pb-6 border-t border-parchment-200 text-center overflow-hidden relative">
          <div className="inline-flex flex-col items-center justify-center gap-4 relative">
            <Image
              src="/cinemerch-logo-transparent.png"
              alt="Logo de CineMerch"
              width={1410}
              height={1116}
              className="h-auto w-28 sm:w-36"
            />
            <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-black text-cine-900 tracking-tighter leading-none select-none hover:text-cine-800 transition-colors">
              CineMerch
            </h2>
          </div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mt-2">
            Cartagena de Indias • Ediciones de Colección & Merch Oficial
          </p>
        </div>

        {/* Payment Badges & Legal info (Visa, Nequi, Bancolombia, Bre-B, Wompi, PSE) */}
        <div className="pt-6 border-t border-parchment-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 CineMerch E-Commerce. Proyecto Universidad de Cartagena.</p>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-zinc-600">
            <span className="bg-white px-2.5 py-1 rounded border border-parchment-300 font-bold text-cine-900 shadow-sm">WOMPI · SIMULACIÓN</span>
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
