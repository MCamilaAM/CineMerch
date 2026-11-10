"use client";

import React, { useState } from "react";
import { Film, Disc } from "lucide-react";

interface CineImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

const DEFAULT_POSTER_FALLBACK = "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg";

export default function CineImage({
  src,
  alt = "Edición de Cine",
  className = "",
  fallbackTitle,
  ...props
}: CineImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback Display if image fails to load */}
      {error ? (
        <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-cine-950 via-cine-900 to-black flex flex-col items-center justify-center p-4 text-center border border-cine-800">
          <div className="w-12 h-12 rounded-full bg-cine-800/80 border border-amber-400/50 flex items-center justify-center mb-2 shadow-inner">
            <Film className="w-6 h-6 text-amber-300" />
          </div>
          <p className="text-[11px] font-serif font-black text-amber-200 line-clamp-2">
            {fallbackTitle || alt}
          </p>
          <span className="text-[9px] uppercase tracking-widest text-zinc-400 mt-1 font-mono">
            Edición Oficial 4K
          </span>
        </div>
      ) : (
        <>
          {/* Skeleton placeholder while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-cine-950/70 animate-pulse flex items-center justify-center">
              <Disc className="w-6 h-6 text-cine-700 animate-spin" />
            </div>
          )}
          <img
            src={src || DEFAULT_POSTER_FALLBACK}
            alt={alt}
            onError={() => setError(true)}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            {...props}
          />
        </>
      )}
    </div>
  );
}
