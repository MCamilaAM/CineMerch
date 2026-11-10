// TMDB API Service for CineMerch

export type TMDBDataSource = "api" | "curated" | "synthetic";

export interface TMDBMovieData {
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  director: string;
  cast: string;
  studio: string;
  year: number;
  posterUrl: string;
  backdropUrl: string;
  tmdbRating: number;
  source?: TMDBDataSource;
}

// Pre-curated fallback dictionary for instant enrichment even without external API key
const CURATED_TMDB_FALLBACKS: Record<number, Partial<TMDBMovieData>> = {
  24: {
    tmdbId: 24,
    title: "Kill Bill: Vol. 1",
    originalTitle: "Kill Bill: Vol. 1",
    overview: "Tras despertar de un coma de cuatro años, La Novia emprende una implacable venganza contra el escuadrón de asesinos que intentó matarla el día de su boda.",
    director: "Quentin Tarantino",
    cast: "Uma Thurman, Lucy Liu, Vivica A. Fox, David Carradine",
    studio: "Miramax Films",
    year: 2003,
    posterUrl: "https://image.tmdb.org/t/p/w780/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    tmdbRating: 8.7,
  },
  78: {
    tmdbId: 78,
    title: "Blade Runner",
    originalTitle: "Blade Runner",
    overview: "En un Los Ángeles futurista y distópico de 2019, el ex detective Rick Deckard es reclutado para dar caza a un grupo de replicantes rebeldes.",
    director: "Ridley Scott",
    cast: "Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos",
    studio: "Warner Bros. Pictures",
    year: 1982,
    posterUrl: "https://image.tmdb.org/t/p/w780/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    tmdbRating: 8.9,
  },
  155: {
    tmdbId: 155,
    title: "Batman: El Caballero de la Noche",
    originalTitle: "The Dark Knight",
    overview: "Con la ayuda del teniente Jim Gordon y el fiscal Harvey Dent, Batman busca desmantelar el crimen organizado en Gotham hasta enfrentar al caótico Joker.",
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Gary Oldman",
    studio: "Warner Bros. / Syncopy",
    year: 2008,
    posterUrl: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    tmdbRating: 9.1,
  },
  238: {
    tmdbId: 238,
    title: "El Padrino",
    originalTitle: "The Godfather",
    overview: "Don Vito Corleone, patriarca de una poderosa dinastía criminal de Nueva York, transfiere el control de su imperio clandestino a su hijo menor Michael.",
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino, James Caan, Robert Duvall",
    studio: "Paramount Pictures",
    year: 1972,
    posterUrl: "https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    tmdbRating: 9.2,
  },
  694: {
    tmdbId: 694,
    title: "El Resplandor",
    originalTitle: "The Shining",
    overview: "Jack Torrance acepta cuidar el aislado Hotel Overlook durante el invierno junto a su esposa y su hijo Danny, cuyas visiones psíquicas desatan la locura.",
    director: "Stanley Kubrick",
    cast: "Jack Nicholson, Shelley Duvall, Danny Lloyd, Scatman Crothers",
    studio: "Warner Bros. Pictures",
    year: 1980,
    posterUrl: "https://image.tmdb.org/t/p/w780/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
    tmdbRating: 8.8,
  },
  27205: {
    tmdbId: 27205,
    title: "El Origen",
    originalTitle: "Inception",
    overview: "Dom Cobb, un ladrón experto en extraer secretos del subconsciente a través de los sueños, recibe una última misión casi imposible: implantar una idea.",
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
    studio: "Warner Bros. / Syncopy",
    year: 2010,
    posterUrl: "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    tmdbRating: 8.8,
  },
  438631: {
    tmdbId: 438631,
    title: "Dune",
    originalTitle: "Dune",
    overview: "Paul Atreides viaja al peligroso planeta desértico Arrakis para asegurar el futuro de su casa noble mientras fuerzas hostiles disputan el recurso más valioso del universo.",
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac, Zendaya",
    studio: "Warner Bros. / Legendary",
    year: 2021,
    posterUrl: "https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    tmdbRating: 8.7,
  },
  872585: {
    tmdbId: 872585,
    title: "Oppenheimer",
    originalTitle: "Oppenheimer",
    overview: "La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.",
    director: "Christopher Nolan",
    cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
    studio: "Universal Pictures / Syncopy",
    year: 2023,
    posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    tmdbRating: 8.9,
  },
  680: {
    tmdbId: 680,
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    overview: "Las vidas de dos matones de la mafia, un boxeador, la esposa de un gángster y dos bandidos de poca monta se entrelazan en cuatro historias de violencia y redención.",
    director: "Quentin Tarantino",
    cast: "John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis",
    studio: "Miramax Films",
    year: 1994,
    posterUrl: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    tmdbRating: 8.9,
  },
  693134: {
    tmdbId: 693134,
    title: "Dune: Parte Dos",
    originalTitle: "Dune: Part Two",
    overview: "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.",
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem",
    studio: "Warner Bros. / Legendary",
    year: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    tmdbRating: 8.8,
  },
  157336: {
    tmdbId: 157336,
    title: "Interstellar",
    originalTitle: "Interstellar",
    overview: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.",
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    studio: "Paramount / Warner Bros.",
    year: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    tmdbRating: 9.0,
  },
  558449: {
    tmdbId: 558449,
    title: "Gladiator II",
    originalTitle: "Gladiator II",
    overview: "Años después de presenciar la muerte del admirado héroe Máximo, Lucio se ve obligado a entrar en el Coliseo tras ser conquistado su hogar por los tiránicos emperadores.",
    director: "Ridley Scott",
    cast: "Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen",
    studio: "Paramount Pictures",
    year: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    tmdbRating: 8.4,
  },
  426063: {
    tmdbId: 426063,
    title: "Nosferatu",
    originalTitle: "Nosferatu",
    overview: "Una historia gótica de obsesión entre una joven embrujada en la Alemania del siglo XIX y el antiguo vampiro de Transilvania que la acecha.",
    director: "Robert Eggers",
    cast: "Bill Skarsgård, Lily-Rose Depp, Nicholas Hoult, Willem Dafoe",
    studio: "Focus Features",
    year: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w780/d0B8xDdqBZlzlPEzES8lu5LlNQn.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/d0B8xDdqBZlzlPEzES8lu5LlNQn.jpg",
    tmdbRating: 8.6,
  }
};

export async function fetchTMDBMovieDetails(tmdbId: number): Promise<TMDBMovieData | null> {
  const apiKey = (process.env.TMDB_API_KEY || "").trim();

  // If key exists, attempt live TMDB API call (supports both v3 API key and v4 Read Access Token)
  if (apiKey) {
    try {
      const isBearerToken = apiKey.startsWith("eyJ");
      const url = isBearerToken
        ? `https://api.themoviedb.org/3/movie/${tmdbId}?language=es-MX&append_to_response=credits`
        : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${encodeURIComponent(apiKey)}&language=es-MX&append_to_response=credits`;

      const fetchOptions: RequestInit = {
        headers: isBearerToken ? { Authorization: `Bearer ${apiKey}` } : undefined,
        ...(process.env.NEXT_RUNTIME ? { next: { revalidate: 3600 } } : {}),
      };

      const res = await fetch(url, fetchOptions);
      if (res.ok) {
        const data = await res.json();
        const directorObj = data.credits?.crew?.find((c: any) => c.job === "Director");
        const castMembers = data.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(", ");
        const studioName = data.production_companies?.[0]?.name || "Estudio Cinematográfico";
        const year = data.release_date ? new Date(data.release_date).getFullYear() : 2024;
        const curatedFallback = CURATED_TMDB_FALLBACKS[tmdbId];

        return {
          tmdbId: data.id,
          title: data.title,
          originalTitle: data.original_title,
          overview: data.overview || "Sin sinopsis disponible.",
          director: directorObj ? directorObj.name : "Director Cinéfilo",
          cast: castMembers || "Elenco Principal",
          studio: studioName,
          year,
          posterUrl: data.poster_path
            ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
            : curatedFallback?.posterUrl || "",
          backdropUrl: data.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
            : curatedFallback?.backdropUrl || "",
          tmdbRating:
            typeof data.vote_average === "number" ? Number(data.vote_average.toFixed(1)) : 8.5,
          source: "api",
        };
      } else {
        console.warn(`Live TMDB API returned HTTP ${res.status} for movie ${tmdbId}, falling back to curated library`);
      }
    } catch (err) {
      console.warn("Live TMDB fetch failed, falling back to curated library", err);
    }
  }

  // Use curated fallback if present
  if (CURATED_TMDB_FALLBACKS[tmdbId]) {
    const item = CURATED_TMDB_FALLBACKS[tmdbId];
    return {
      tmdbId,
      title: item.title || "Película de Colección",
      originalTitle: item.originalTitle || item.title || "",
      overview: item.overview || "Edición especial para coleccionistas de cine.",
      director: item.director || "Director de Culto",
      cast: item.cast || "Elenco estelar",
      studio: item.studio || "Estudio Oficial",
      year: item.year || 2024,
      posterUrl: item.posterUrl || "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: item.backdropUrl || "https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      tmdbRating: item.tmdbRating || 8.5,
      source: "curated",
    };
  }

  // Default synthetic movie enrichment if arbitrary ID was provided
  return {
    tmdbId,
    title: `Película Cinéfila #${tmdbId}`,
    originalTitle: `Collector Feature #${tmdbId}`,
    overview: "Edición importada de alta definición con transferencia nativa de master y audio sin comprimir.",
    director: "Director Galardonado",
    cast: "Reparto de Primer Nivel",
    studio: "Warner Bros. / Universal / Paramount",
    year: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    tmdbRating: 8.7,
    source: "synthetic",
  };
}
