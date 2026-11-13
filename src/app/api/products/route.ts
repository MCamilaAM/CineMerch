import { failure, requireAdmin } from "@/lib/payment-http";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchTMDBMovieDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const director = searchParams.get("director");
    const format = searchParams.get("format");
    const query = searchParams.get("q");
    const isPreorder = searchParams.get("isPreorder");
    const isBundle = searchParams.get("isBundle");

    const where: any = {};

    if (category && category !== "Todos") {
      where.category = category;
    }
    if (director && director !== "Todos") {
      where.director = { contains: director };
    }
    if (format && format !== "Todos") {
      where.format = format;
    }
    if (isPreorder === "true") {
      where.isPreorder = true;
    }
    if (isBundle === "true") {
      where.isBundle = true;
    }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { originalTitle: { contains: query } },
        { director: { contains: query } },
        { overview: { contains: query } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    let {
      title,
      tmdbId,
      price,
      format,
      category,
      director,
      overview,
      year,
      posterUrl,
      backdropUrl,
      stock,
      isPreorder,
      preorderReleaseDate,
      isBundle,
      bundleIncludes,
      audioSpecs,
      subtitleSpecs,
      regionCode,
    } = body;

    // If TMDB ID provided, auto-enrich missing fields (US-05)
    if (tmdbId) {
      const tmdbData = await fetchTMDBMovieDetails(Number(tmdbId));
      if (tmdbData) {
        title = title || tmdbData.title;
        director = director || tmdbData.director;
        overview = overview || tmdbData.overview;
        year = year || tmdbData.year;
        posterUrl = posterUrl || tmdbData.posterUrl;
        backdropUrl = backdropUrl || tmdbData.backdropUrl;
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        tmdbId: tmdbId ? Number(tmdbId) : null,
        price: Number(price) || 150000,
        format: format || "4K UHD",
        category: category || "Colección",
        director: director || "Director Cinéfilo",
        overview: overview || "Edición física oficial para coleccionistas de cine.",
        year: Number(year) || 2024,
        posterUrl: posterUrl || "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        backdropUrl,
        stock: Number(stock) || 10,
        isPreorder: Boolean(isPreorder),
        preorderReleaseDate: preorderReleaseDate ? new Date(preorderReleaseDate) : null,
        isBundle: Boolean(isBundle),
        bundleIncludes,
        audioSpecs: audioSpecs || "Dolby Atmos / DTS-HD Master Audio",
        subtitleSpecs: subtitleSpecs || "Español Latino, Inglés SDH",
        regionCode: regionCode || "Región Libre (4K)",
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return failure(error);
  }
}
