import { NextRequest, NextResponse } from "next/server";
import { fetchTMDBMovieDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tmdbIdParam = searchParams.get("id");

    if (!tmdbIdParam) {
      return NextResponse.json(
        { success: false, error: "Debes proporcionar un ID de TMDB (ej. 872585 para Oppenheimer)" },
        { status: 400 }
      );
    }

    const tmdbId = parseInt(tmdbIdParam, 10);
    if (isNaN(tmdbId)) {
      return NextResponse.json(
        { success: false, error: "El ID de TMDB debe ser un número entero válido" },
        { status: 400 }
      );
    }

    const movie = await fetchTMDBMovieDetails(tmdbId);
    if (!movie) {
      return NextResponse.json(
        { success: false, error: "No se encontraron metadatos para este ID de película" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar TMDB" },
      { status: 500 }
    );
  }
}
