"use client";

import React from "react";

/**
 * 35mm Film Reel Decoration
 * Replaces the pretzel graphic with a metallic cinema reel with wound tape and spokes
 */
export function FilmReelDecoration({
  size = 180,
  className = "",
  rotation = 0,
}: {
  size?: number;
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative select-none pointer-events-none drop-shadow-2xl ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-700 hover:rotate-45"
      >
        <defs>
          {/* Metallic golden-bronze radial gradient */}
          <radialGradient id="reelMetallic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="40%" stopColor="#B45309" />
            <stop offset="70%" stopColor="#78350F" />
            <stop offset="95%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1E0B05" />
          </radialGradient>
          {/* Tape wrap color */}
          <radialGradient id="tapeWrap" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1B18" />
            <stop offset="85%" stopColor="#150D0C" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>
          <filter id="reelShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer Shadowed Rim */}
        <circle cx="100" cy="100" r="92" fill="url(#reelMetallic)" filter="url(#reelShadow)" />
        <circle cx="100" cy="100" r="88" stroke="#FDE68A" strokeWidth="2" strokeOpacity="0.7" fill="none" />

        {/* Wound Film Tape layer between rim and inner core */}
        <circle cx="100" cy="100" r="76" fill="url(#tapeWrap)" />
        {/* Subtle tape wound rings */}
        <circle cx="100" cy="100" r="70" stroke="#451A03" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="100" cy="100" r="62" stroke="#2B1408" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="100" cy="100" r="54" stroke="#451A03" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Inner Metal Flange */}
        <circle cx="100" cy="100" r="46" fill="url(#reelMetallic)" stroke="#FDE68A" strokeWidth="1.5" />

        {/* 5 Characteristic Film Reel Spokes / Cutout Holes */}
        {[0, 72, 144, 216, 288].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 26 * Math.cos(rad);
          const cy = 100 + 26 * Math.sin(rad);
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r="10"
              fill="#180C0B"
              stroke="#78350F"
              strokeWidth="2"
            />
          );
        })}

        {/* Center Hub & Spindle Mount */}
        <circle cx="100" cy="100" r="14" fill="#FBBF24" stroke="#78350F" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="6" fill="#1C0A06" />

        {/* Trailing loose film ribbon peeling off reel */}
        <path
          d="M 180 85 C 210 60, 215 130, 240 120"
          stroke="#261411"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

/**
 * Curled Celluloid Film Strip Decoration with sprocket holes
 */
export function FilmStripCurled({
  className = "",
  width = 240,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <div
      style={{ width }}
      className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    >
      <svg
        viewBox="0 0 260 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="filmTapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1412" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#3B1C17" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E1412" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Wavy Film Strip Body */}
        <path
          d="M 10 45 C 50 15, 100 75, 150 35 C 200 -5, 230 65, 250 40 L 250 65 C 230 90, 200 20, 150 60 C 100 100, 50 40, 10 70 Z"
          fill="url(#filmTapeGrad)"
          stroke="#78350F"
          strokeWidth="1.5"
        />

        {/* Top Perforation Sprockets */}
        {[20, 45, 70, 95, 120, 145, 170, 195, 220, 240].map((x, i) => {
          const y = 35 + 15 * Math.sin(i * 0.7);
          return (
            <rect
              key={`top-${i}`}
              x={x}
              y={y - 8}
              width="6"
              height="4"
              rx="1"
              fill="#FDE68A"
              fillOpacity="0.8"
            />
          );
        })}

        {/* Bottom Perforation Sprockets */}
        {[20, 45, 70, 95, 120, 145, 170, 195, 220, 240].map((x, i) => {
          const y = 55 + 15 * Math.sin(i * 0.7);
          return (
            <rect
              key={`bot-${i}`}
              x={x}
              y={y + 4}
              width="6"
              height="4"
              rx="1"
              fill="#FDE68A"
              fillOpacity="0.8"
            />
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Director's Clapperboard Decoration
 */
export function ClapperboardDecoration({
  size = 140,
  className = "",
  rotation = -12,
}: {
  size?: number;
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      style={{
        width: size,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`select-none pointer-events-none drop-shadow-2xl ${className}`}
    >
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <filter id="clapShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Top Clapper Arm (Slightly Open) */}
        <g transform="rotate(-18 20 40)">
          <rect x="15" y="22" width="130" height="22" rx="3" fill="#1C1917" filter="url(#clapShadow)" />
          {/* Diagonal White Stripes */}
          <polygon points="25,22 38,22 28,44 15,44" fill="#FAF5EF" />
          <polygon points="52,22 65,22 55,44 42,44" fill="#FAF5EF" />
          <polygon points="79,22 92,22 82,44 69,44" fill="#FAF5EF" />
          <polygon points="106,22 119,22 109,44 96,44" fill="#FAF5EF" />
          <polygon points="133,22 145,22 136,44 123,44" fill="#FAF5EF" />
          {/* Metal hinge bolt */}
          <circle cx="24" cy="33" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
        </g>

        {/* Main Slate Body */}
        <rect x="15" y="44" width="130" height="85" rx="5" fill="#1C1917" stroke="#44403C" strokeWidth="2" filter="url(#clapShadow)" />

        {/* Board Chevrons base */}
        <polygon points="25,44 38,44 28,60 15,60" fill="#FAF5EF" />
        <polygon points="52,44 65,44 55,60 42,60" fill="#FAF5EF" />
        <polygon points="79,44 92,44 82,60 69,60" fill="#FAF5EF" />
        <polygon points="106,44 119,44 109,60 96,60" fill="#FAF5EF" />
        <polygon points="133,44 145,44 136,60 123,60" fill="#FAF5EF" />

        {/* Slate Chalk Data */}
        <text x="25" y="76" fill="#FBBF24" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          PROD: CINEMERCH
        </text>
        <text x="25" y="92" fill="#FAF5EF" fontSize="8" fontFamily="sans-serif" opacity="0.9">
          SCENE: 4K • TAKE: 1
        </text>
        <text x="25" y="108" fill="#FDE68A" fontSize="7" fontFamily="sans-serif" opacity="0.8">
          DIRECTOR: COLECCIONISTA
        </text>
        <text x="25" y="122" fill="#E7E5E4" fontSize="7" fontFamily="sans-serif" opacity="0.7">
          DATE: 2026 • CARTAGENA
        </text>
      </svg>
    </div>
  );
}

/**
 * Vintage Golden Cinema Ticket ("ADMIT ONE")
 */
export function GoldenTicketDecoration({
  size = 130,
  className = "",
  rotation = 15,
}: {
  size?: number;
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      style={{
        width: size,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`select-none pointer-events-none drop-shadow-xl ${className}`}
    >
      <svg
        viewBox="0 0 140 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* Ticket Base with Side Perforation Cutouts */}
        <path
          d="M 6 0 L 134 0 C 137 0, 140 3, 140 6 L 140 30 C 134 30, 130 33.5, 130 37.5 C 130 41.5, 134 45, 140 45 L 140 69 C 140 72, 137 75, 134 75 L 6 75 C 3 75, 0 72, 0 69 L 0 45 C 6 45, 10 41.5, 10 37.5 C 10 33.5, 6 30, 0 30 L 0 6 C 0 3, 3 0, 6 0 Z"
          fill="url(#ticketGrad)"
          stroke="#FDE68A"
          strokeWidth="1.5"
        />

        {/* Dashed Tear Line */}
        <line x1="38" y1="6" x2="38" y2="69" stroke="#78350F" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Left Serial */}
        <text x="12" y="42" fill="#451A03" fontSize="8" fontWeight="bold" fontFamily="monospace" transform="rotate(-90 12 42)">
          № 08842
        </text>

        {/* Main Content */}
        <text x="50" y="28" fill="#451A03" fontSize="10" fontWeight="900" fontFamily="serif" letterSpacing="1">
          CINEMERCH
        </text>
        <text x="54" y="44" fill="#FEF3C7" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
          ★ ADMIT ONE ★
        </text>
        <text x="58" y="58" fill="#451A03" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
          PREMIERE VIP
        </text>
      </svg>
    </div>
  );
}

/**
 * Floating Cinema Margins Decorator
 * Places cinema elements across the outer negative space and section boundaries
 * exactly where the reference image has floating pretzels and strawberries!
 */
export function FloatingCinemaCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Hero Floating Elements (Right & Left) */}
      <div className="absolute -top-6 -right-10 md:top-4 md:right-4 opacity-85 transform hover:scale-105 transition-transform duration-700">
        <FilmReelDecoration size={210} rotation={24} />
      </div>

      <div className="absolute top-16 -left-12 md:left-6 opacity-75 transform -rotate-12">
        <ClapperboardDecoration size={160} rotation={-15} />
      </div>

      <div className="absolute top-48 right-16 hidden lg:block opacity-70">
        <GoldenTicketDecoration size={120} rotation={18} />
      </div>

      <div className="absolute top-72 left-8 hidden lg:block opacity-65">
        <FilmStripCurled width={220} className="transform rotate-12" />
      </div>

      {/* Mid Page Floating Elements */}
      <div className="absolute top-[1250px] -right-12 md:right-4 opacity-75 hidden md:block">
        <FilmReelDecoration size={190} rotation={-35} />
      </div>

      <div className="absolute top-[1450px] -left-10 md:left-4 opacity-70 hidden md:block">
        <GoldenTicketDecoration size={140} rotation={-22} />
      </div>

      {/* Near Testimonials & FAQs */}
      <div className="absolute top-[2300px] -right-8 md:right-8 opacity-70 hidden lg:block">
        <ClapperboardDecoration size={150} rotation={14} />
      </div>

      <div className="absolute top-[2600px] -left-8 md:left-6 opacity-65 hidden lg:block">
        <FilmReelDecoration size={175} rotation={40} />
      </div>

      {/* Bottom Margins near Newsletter & Footer */}
      <div className="absolute bottom-48 -right-10 md:right-8 opacity-80">
        <FilmReelDecoration size={200} rotation={-15} />
      </div>

      <div className="absolute bottom-24 -left-10 md:left-8 opacity-75">
        <GoldenTicketDecoration size={135} rotation={25} />
      </div>
    </div>
  );
}
