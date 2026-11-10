import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { fetchTMDBMovieDetails } from "../src/lib/tmdb";

function loadEnvFromDisk() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx <= 0) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = val;
    }
  }
}

loadEnvFromDisk();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CineMerch database with verified high-definition cinema artwork...");
  if (process.env.TMDB_API_KEY?.trim()) {
    console.log("TMDB_API_KEY detected: resolving movie posters and backdrops dynamically from live TMDB API...");
  } else {
    console.log("TMDB_API_KEY not configured: resolving movie posters via curated TMDB library (src/lib/tmdb.ts)...");
  }

  // Clean existing products and reviews
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.waitlistLead.deleteMany({});
  await prisma.order.deleteMany({});

  const products = [
    {
      id: "prod-oppenheimer-steelbook",
      title: "Oppenheimer - Steelbook Edición Especial 4K UHD",
      originalTitle: "Oppenheimer",
      tmdbId: 872585,
      overview: "La aclamada obra maestra ganadora de 7 Premios Oscar dirigida por Christopher Nolan. Edición coleccionista con estuche metálico de acabado mate y relieve, libreto con anotaciones de producción y más de 3 horas de material extra inédito.",
      price: 179000,
      format: "Steelbook",
      category: "Drama",
      director: "Christopher Nolan",
      cast: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh",
      studio: "Universal Pictures / Syncopy",
      year: 2023,
      posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      stock: 12,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "Dolby Atmos (Inglés), Dolby Digital 5.1 (Español Latino)",
      subtitleSpecs: "Español Latino, Inglés SDH, Francés",
      regionCode: "Región Libre 4K / Región A (Blu-ray Extras)",
      tmdbRating: 8.9,
    },
    {
      id: "prod-pulp-fiction-30th",
      title: "Pulp Fiction: 30° Aniversario - Steelbook 4K UHD",
      originalTitle: "Pulp Fiction",
      tmdbId: 680,
      overview: "El hito del cine de Quentin Tarantino remasterizado en 4K nativo con Dolby Vision. Incluye empaque de lata exclusivo, litografías con el baile de Vincent Vega y Mia Wallace, y menú interactivo de colección.",
      price: 169000,
      format: "Steelbook",
      category: "Acción",
      director: "Quentin Tarantino",
      cast: "John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis",
      studio: "Miramax / Paramount",
      year: 1994,
      posterUrl: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      stock: 18,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD Master Audio 5.1 (Inglés & Español)",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre (4K UHD)",
      tmdbRating: 8.9,
    },
    {
      id: "prod-shining-4k",
      title: "El Resplandor (The Shining) - 4K UHD Remastered",
      originalTitle: "The Shining",
      tmdbId: 694,
      overview: "La cumbre del terror psicológico de Stanley Kubrick, transferida directamente del negativo de 35mm con supervisión de Steven Spielberg y la familia Kubrick. Una experiencia hipnótica con HDR10 y relación de aspecto cinematográfica original.",
      price: 159000,
      format: "4K UHD",
      category: "Terror",
      director: "Stanley Kubrick",
      cast: "Jack Nicholson, Shelley Duvall, Danny Lloyd, Scatman Crothers",
      studio: "Warner Bros. Pictures",
      year: 1980,
      posterUrl: "https://image.tmdb.org/t/p/w780/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
      stock: 10,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD MA 5.1 (Restauración completa de audio)",
      subtitleSpecs: "Español Latino, Inglés SDH, Alemán, Francés",
      regionCode: "Región Libre (4K UHD)",
      tmdbRating: 8.8,
    },
    {
      id: "prod-dune-part-two",
      title: "Dune: Parte Dos - Steelbook Glow in Dark 4K UHD",
      originalTitle: "Dune: Part Two",
      tmdbId: 693134,
      overview: "La monumental visión de Denis Villeneuve para la novela de Frank Herbert. Este steelbook oficial brilla en la oscuridad en los detalles de las arenas de Arrakis. Sonido de referencia Dolby Atmos y relación de aspecto IMAX ampliada.",
      price: 189000,
      format: "Steelbook",
      category: "Sci-Fi",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler",
      studio: "Warner Bros. / Legendary",
      year: 2024,
      posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      stock: 15,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "Dolby Atmos, Dolby TrueHD 7.1",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.8,
    },
    {
      id: "prod-dark-knight-trilogy",
      title: "Batman: Trilogía The Dark Knight - Box Set Ultimate 4K",
      originalTitle: "The Dark Knight Trilogy",
      tmdbId: 155,
      overview: "Batman Begins, The Dark Knight y The Dark Knight Rises en una caja de lujo con acabado táctil negro mate. Incluye 9 discos, cartas de villanos, libreto de 48 páginas y mini reproducciones de arte conceptual.",
      price: 269000,
      format: "Box Set",
      category: "Acción",
      director: "Christopher Nolan",
      cast: "Christian Bale, Heath Ledger, Michael Caine, Gary Oldman, Tom Hardy",
      studio: "Warner Bros. / Syncopy",
      year: 2008,
      posterUrl: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      stock: 6,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD Master Audio 5.1 (Inglés y Español)",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre (4K)",
      tmdbRating: 9.1,
    },
    {
      id: "prod-kit-godfather",
      title: "Kit Temático: El Padrino 50 Años - Colección Don Corleone",
      originalTitle: "The Godfather 50th Anniversary Bundle",
      tmdbId: 238,
      overview: "El paquete definitivo para celebrar el medio siglo de la epopeya de Francis Ford Coppola. Incluye la Trilogía Restaurada en 4K UHD, réplica de la emblemática flor roja de Vito Corleone, libreto de anotaciones del director y postal firmada facsímil.",
      price: 239000,
      format: "Kit",
      category: "Kits",
      director: "Francis Ford Coppola",
      cast: "Marlon Brando, Al Pacino, James Caan, Robert Duvall",
      studio: "Paramount Pictures",
      year: 1972,
      posterUrl: "https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      stock: 8,
      isBundle: true,
      bundleIncludes: "Trilogía 4K UHD (3 Discos) + Pin metálico solapa rosa de Vito + Cuaderno de rodaje exclusivo + Tarjeta coleccionista",
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "Dolby TrueHD 5.1 (Restauración completa)",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 9.2,
    },
    {
      id: "prod-kit-dune-bundle",
      title: "Kit Fanático: Trilogía Arrakis + Mini Réplica Ornitóptero",
      originalTitle: "Dune Arrakis Collector Kit",
      tmdbId: 438631,
      overview: "Pack que reúne la película Dune (2021) y Dune: Parte Dos (2024) en Steelbooks metálicos + modelo a escala de metal fundido del Ornitóptero Atreides + mapa de tela de las tierras del desierto.",
      price: 249000,
      format: "Kit",
      category: "Kits",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Rebecca Ferguson, Oscar Isaac",
      studio: "Warner Bros.",
      year: 2024,
      posterUrl: "https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      stock: 5,
      isBundle: true,
      bundleIncludes: "2 Steelbooks 4K UHD + Maqueta metálica de Ornitóptero + Mapa pergamino de Arrakis",
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "Dolby Atmos",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.7,
    },
    {
      id: "prod-interstellar-box",
      title: "Interstellar: 10° Aniversario - Edición IMAX 4K UHD",
      originalTitle: "Interstellar",
      tmdbId: 157336,
      overview: "La odisea cósmica de Christopher Nolan. Presentada en transfer 4K con secuencias en IMAX de pantalla completa sin barras negras. Incluye parche bordado de la misión Endurance y réplica del reloj de Murphy.",
      price: 199000,
      format: "Steelbook",
      category: "Sci-Fi",
      director: "Christopher Nolan",
      cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
      studio: "Paramount / Warner Bros.",
      year: 2014,
      posterUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      stock: 11,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD Master Audio 5.1 (Banda sonora visceral de Hans Zimmer)",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 9.0,
    },
    {
      id: "prod-preorder-gladiator-2",
      title: "Gladiator II - Steelbook Exclusivo 4K UHD (PREVENTA)",
      originalTitle: "Gladiator II",
      tmdbId: 558449,
      overview: "PREVENTA OFICIAL: La esperada secuela épica de Ridley Scott. Asegura tu copia antes del estreno en formato físico. Entrega estimada garantizada en Cartagena y Colombia con empaque blindado.",
      price: 185000,
      format: "Steelbook",
      category: "Acción",
      director: "Ridley Scott",
      cast: "Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen",
      studio: "Paramount Pictures",
      year: 2024,
      posterUrl: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      stock: 25,
      isPreorder: true,
      preorderReleaseDate: new Date("2026-11-20T00:00:00Z"),
      isBestSeller: false,
      audioSpecs: "Dolby Atmos / Dolby Vision",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.4,
    },
    {
      id: "prod-blade-runner-collector",
      title: "Blade Runner: Final Cut - Steelbook 4K UHD",
      originalTitle: "Blade Runner",
      tmdbId: 78,
      overview: "La cumbre del ciberpunk dirigida por Ridley Scott en su montaje definitivo aprobado por el director. Escaneado en 4K con Dolby Vision y audio Atmos inmersivo con la mítica banda sonora de Vangelis.",
      price: 175000,
      format: "Steelbook",
      category: "Sci-Fi",
      director: "Ridley Scott",
      cast: "Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos",
      studio: "Warner Bros. Pictures",
      year: 1982,
      posterUrl: "https://image.tmdb.org/t/p/w780/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
      stock: 14,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "Dolby Atmos, Dolby TrueHD 7.1",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.9,
    },
    {
      id: "prod-inception-steelbook",
      title: "Inception (El Origen) - Steelbook 4K UHD 10° Aniversario",
      originalTitle: "Inception",
      tmdbId: 27205,
      overview: "El laberinto onírico de Christopher Nolan en 4K UHD. Estuche metálico con relieve de la peonza de Cobb, libreto exclusivo de bocetos de producción y dos discos de contenidos adicionales.",
      price: 179000,
      format: "Steelbook",
      category: "Sci-Fi",
      director: "Christopher Nolan",
      cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
      studio: "Warner Bros. / Syncopy",
      year: 2010,
      posterUrl: "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      stock: 12,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD Master Audio 5.1",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.8,
    },
    {
      id: "prod-kill-bill-steelbook",
      title: "Kill Bill: Vol. 1 - Steelbook 4K UHD Edición Amarilla",
      originalTitle: "Kill Bill: Vol. 1",
      tmdbId: 24,
      overview: "La sangrienta epopeya de artes marciales de Quentin Tarantino restaurada en 4K con el icónico traje amarillo de La Novia en acabado barniz brillante. Incluye postales de los 88 Maníacos.",
      price: 169000,
      format: "Steelbook",
      category: "Acción",
      director: "Quentin Tarantino",
      cast: "Uma Thurman, Lucy Liu, Vivica A. Fox, David Carradine",
      studio: "Miramax Films",
      year: 2003,
      posterUrl: "https://image.tmdb.org/t/p/w780/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
      stock: 16,
      isPreorder: false,
      isBestSeller: true,
      audioSpecs: "DTS-HD Master Audio 5.1",
      subtitleSpecs: "Español Latino, Inglés SDH",
      regionCode: "Región Libre 4K",
      tmdbRating: 8.7,
    },
    {
      id: "prod-protectores-steelbook",
      title: "Pack 10 Protectores Rígidos PET para Steelbooks",
      originalTitle: "10-Pack PET Steelbook Protective Sleeves",
      overview: "Fundas plásticas protectoras de polietileno transparente de 0.4mm, 100% libre de ácidos. Evitan roces, rayones en la pintura metálica y entrada de polvo. El accesorio indispensable de todo coleccionista.",
      price: 28000,
      format: "Merch",
      category: "Accesorios",
      director: "CineMerch Essentials",
      year: 2026,
      posterUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/HD-DVD_and_Blu-Ray_cases_%28crop%29.jpg",
      stock: 40,
      isPreorder: false,
      isBestSeller: true,
      regionCode: "Universal",
      tmdbRating: 9.5,
    },
    {
      id: "prod-claqueta-profesional",
      title: "Claqueta Cinematográfica Acrílica con Sonido Real",
      originalTitle: "Director Clapperboard Acrylic",
      overview: "Claqueta de cine profesional con bisagra magnética de chasquido nítido. Superficie blanca en acrílico borrable para marcador. Ideal para set de grabación o exhibición en tu repisa de películas.",
      price: 49000,
      format: "Merch",
      category: "Accesorios",
      director: "CineMerch Studio",
      year: 2026,
      posterUrl: "https://images.unsplash.com/photo-1637248578458-934f03db3ea2?w=600&auto=format&fit=crop&q=80",
      stock: 22,
      isPreorder: false,
      isBestSeller: true,
      regionCode: "Universal",
      tmdbRating: 9.3,
    },
    {
      id: "prod-poster-metalico-pulp",
      title: "Placa Metálica Vintage: Pulp Fiction Dance Scene",
      originalTitle: "Pulp Fiction Metal Wall Art Plate",
      overview: "Póster sobre lámina de aluminio pulido con tratamiento antirreflejo. Ilustración icónica del baile de Vincent Vega en Jack Rabbit Slim's. Medidas 30x40 cm con imán autoadhesivo para colgar sin taladrar.",
      price: 65000,
      format: "Merch",
      category: "Accesorios",
      director: "Quentin Tarantino Art",
      year: 2026,
      posterUrl: "https://image.tmdb.org/t/p/w780/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      stock: 14,
      isPreorder: false,
      isBestSeller: false,
      regionCode: "Universal",
      tmdbRating: 9.0,
    }
  ];

  let apiResolvedCount = 0;
  let curatedResolvedCount = 0;

  for (const prod of products) {
    let posterUrl = prod.posterUrl;
    let backdropUrl = "backdropUrl" in prod ? prod.backdropUrl : undefined;
    let tmdbRating = prod.tmdbRating;

    if ("tmdbId" in prod && typeof prod.tmdbId === "number") {
      const tmdbData = await fetchTMDBMovieDetails(prod.tmdbId);
      if (tmdbData && tmdbData.source !== "synthetic") {
        if (tmdbData.posterUrl) posterUrl = tmdbData.posterUrl;
        if (tmdbData.backdropUrl) backdropUrl = tmdbData.backdropUrl;
        if (tmdbData.source === "api") {
          apiResolvedCount++;
          if (tmdbData.tmdbRating > 0) tmdbRating = tmdbData.tmdbRating;
        } else if (tmdbData.source === "curated") {
          curatedResolvedCount++;
        }
      }
    }

    await prisma.product.create({
      data: {
        ...prod,
        posterUrl,
        ...(backdropUrl !== undefined ? { backdropUrl } : {}),
        tmdbRating,
      },
    });
  }

  console.log(
    `TMDB poster resolution summary: ${apiResolvedCount} live API, ${curatedResolvedCount} curated fallback.`
  );

  // Create initial reviews
  await prisma.review.createMany({
    data: [
      {
        productId: "prod-oppenheimer-steelbook",
        author: "Carlos E. Mendoza",
        rating: 5,
        comment: "El steelbook llegó impecable en Cartagena al día siguiente. El empaque de burbuja blindado cuidó las esquinas al 100%. Calidad de imagen en mi OLED es brutal.",
        collectorBadge: "Director VIP",
      },
      {
        productId: "prod-dune-part-two",
        author: "Mariana Restrepo",
        rating: 5,
        comment: "El efecto que brilla en la oscuridad del estuche es una joya. Y el audio Dolby Atmos hace temblar la sala. Totalmente recomendados.",
        collectorBadge: "Protagonista",
      },
      {
        productId: "prod-kit-godfather",
        author: "David Buelvas",
        rating: 5,
        comment: "Compré el bundle para el cumpleaños de mi papá y quedó fascinado con la réplica de la flor y el libreto. Excelente iniciativa cinéfila para el Caribe.",
        collectorBadge: "Coleccionista 4K",
      }
    ]
  });

  // Seed sample waitlist leads to show "cupos restantes"
  const sampleLeads = [
    { fullName: "Andrés Silva", email: "andres.silva@cine.co", phone: "+573001234567", couponCode: "CINEMERCH10-01" },
    { fullName: "Laura Gómez", email: "laura.gomez@cine.co", phone: "+573109876543", couponCode: "CINEMERCH10-02" },
    { fullName: "Juan Carlos Ortiz", email: "juan.ortiz@cine.co", phone: "+573155554321", couponCode: "CINEMERCH10-03" },
    { fullName: "Camila Torres", email: "camila.torres@cine.co", phone: "+573204443322", couponCode: "CINEMERCH10-04" },
    { fullName: "Mateo Herrera", email: "mateo.herrera@cine.co", phone: "+573017778899", couponCode: "CINEMERCH10-05" },
  ];

  for (const lead of sampleLeads) {
    await prisma.waitlistLead.create({
      data: lead,
    });
  }

  // Create a sample order to populate the admin panel
  await prisma.order.create({
    data: {
      orderNumber: "CNM-2026-8841",
      customerName: "Valentina Meza",
      customerEmail: "vmeza@gmail.com",
      customerPhone: "3004567890",
      city: "Cartagena",
      department: "Bolívar",
      address: "Bocagrande Carrera 3ra # 6-40",
      deliveryMethod: "CONTRAENTREGA_LOCAL",
      paymentMethod: "CONTRAENTREGA",
      paymentStatus: "APPROVED",
      subtotal: 189000,
      discount: 0,
      shippingCost: 0,
      total: 189000,
      pointsEarned: 189,
      pointsRedeemed: 0,
      carrier: "Mensajería Local Cartagena",
      trackingNumber: "LOCAL-CTG-904",
      status: "PAGADO",
      itemsJson: JSON.stringify([
        {
          productId: "prod-dune-part-two",
          title: "Dune: Parte Dos - Steelbook Glow in Dark 4K UHD",
          price: 189000,
          quantity: 1,
          format: "Steelbook",
          posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
        }
      ])
    }
  });

  console.log("Database seeded successfully with verified movies, reviews, and sample orders!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
