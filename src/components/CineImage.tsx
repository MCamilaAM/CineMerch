"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = src || DEFAULT_POSTER_FALLBACK;

  useEffect(() => {
    setError(false);
    setLoaded(false);

    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setError(true);
      }
    }
  }, [resolvedSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fallback Display if image fails to load */}
      {error ? (
        <div className="w-full h-full bg-gradient-to-br from-cine-950 via-cine-900 to-black flex flex-col items-center justify-center p-2 text-center border border-cine-800">
          <div className="w-9 h-9 rounded-full bg-cine-800/80 border border-amber-400/50 flex items-center justify-center mb-1.5 shadow-inner shrink-0">
            <Film className="w-4 h-4 text-amber-300" />
          </div>
          <p className="text-[10px] font-serif font-black text-amber-200 line-clamp-2 leading-tight">
            {fallbackTitle || alt}
          </p>
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
            {...props}
            ref={imgRef}
            src={resolvedSrc}
            alt={alt}
            onError={() => setError(true)}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
        </>
      )}
    </div>
  );
}
