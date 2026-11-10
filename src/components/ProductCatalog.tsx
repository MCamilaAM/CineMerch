"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Disc, Sparkles, Filter, ShoppingBag, Eye, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductModal, { MovieProduct } from "@/components/ProductModal";
import CineImage from "@/components/CineImage";
import { trackViewItem } from "@/lib/analytics";

interface ProductCatalogProps {
  initialProducts?: MovieProduct[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export default function ProductCatalog({
  initialProducts,
  title = "Nuestra Selección",
  subtitle = "Ediciones de alta gama curadas por cinéfilos",
  showFilters = true,
}: ProductCatalogProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<MovieProduct[]>(initialProducts || []);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeDirector, setActiveDirector] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<MovieProduct | null>(null);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let url = "/api/products?";
        if (activeCategory !== "Todos") url += `category=${encodeURIComponent(activeCategory)}&`;
        if (activeDirector !== "Todos") url += `director=${encodeURIComponent(activeDirector)}&`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [activeCategory, activeDirector]);

  const categories = ["Todos", "Sci-Fi", "Drama", "Acción", "Terror", "Kits", "Accesorios"];
  const directors = ["Todos", "Christopher Nolan", "Quentin Tarantino", "Denis Villeneuve", "Stanley Kubrick", "Francis Ford Coppola", "Ridley Scott"];

  const handleOpenSpec = (product: MovieProduct) => {
    setSelectedProduct(product);
    trackViewItem({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
    });
  };

  return (
    <section id="catalogo" className="py-16 px-4 sm:px-8 bg-parchment-50 border-t border-parchment-200 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Design matching the user's reference photo */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cine-700 bg-cine-100 px-3 py-1 rounded-full mb-2">
              <Disc className="w-3.5 h-3.5" />
              <span>Catálogo Reactivo & Especializado</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-cine-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 font-light max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Director Quick Filter Pills */}
          {showFilters && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="text-xs font-bold text-zinc-500 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Director:
              </span>
              {directors.map((dir) => (
                <button
                  key={dir}
                  onClick={() => setActiveDirector(dir)}
                  className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                    activeDirector === dir
                      ? "bg-cine-900 text-amber-300 font-bold shadow"
                      : "bg-white text-zinc-700 hover:bg-parchment-200 border border-parchment-300"
                  }`}
                >
                  {dir === "Christopher Nolan"
                    ? "Nolan"
                    : dir === "Quentin Tarantino"
                    ? "Tarantino"
                    : dir === "Denis Villeneuve"
                    ? "Villeneuve"
                    : dir === "Stanley Kubrick"
                    ? "Kubrick"
                    : dir === "Francis Ford Coppola"
                    ? "Coppola"
                    : dir === "Ridley Scott"
                    ? "Scott"
                    : dir}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        {showFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-parchment-200 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs sm:text-sm px-4 py-2 rounded-xl transition-all font-medium whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-cine-800 text-white font-bold shadow-md"
                    : "bg-white text-zinc-600 hover:bg-parchment-100 border border-parchment-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid / Row - Inspired by "Our Pretzels" style in the photo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Decorative Banner Card (like the photo's red "Our Pretzels" block) */}
          <div className="md:col-span-3 bg-gradient-to-br from-cine-900 via-cine-800 to-cine-950 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl border border-cine-800 relative overflow-hidden min-h-[320px]">
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-cine-950/60 px-2.5 py-1 rounded-full border border-cine-700">
                Selección de Autor
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black mt-4 leading-tight">
                Joyas de Culto & 4K Nativo
              </h3>
              <p className="mt-3 text-xs text-zinc-300 leading-relaxed">
                Cada edición incluye transferencias directas de negativo, pistas de audio en español latino y extras que nunca verás en streaming.
              </p>
            </div>

            <div className="relative z-10 pt-6 space-y-3">
              <div className="bg-cine-950/80 p-3 rounded-2xl border border-cine-700/80 text-[11px] text-amber-200">
                <p className="font-bold">🚚 Envío Gratis</p>
                <p className="text-[10px] text-zinc-300">En pedidos desde $150.000 COP a Cartagena y toda Colombia.</p>
              </div>

              <Link
                href="/catalogo"
                className="w-full bg-amber-400 hover:bg-amber-300 text-cine-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Background disc glow */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
          </div>

          {/* Right Product Cards Grid */}
          <div className="md:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse border border-parchment-200 h-96"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-parchment-300 p-8">
                <Disc className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h4 className="font-serif font-bold text-lg text-zinc-700">No encontramos títulos en esta categoría</h4>
                <p className="text-xs text-zinc-500 mt-1">Prueba seleccionando otro director o restableciendo los filtros.</p>
                <button
                  onClick={() => {
                    setActiveCategory("Todos");
                    setActiveDirector("Todos");
                  }}
                  className="mt-4 text-xs font-bold text-cine-700 underline"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-parchment-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Poster Image Container */}
                      <div
                        onClick={() => handleOpenSpec(prod)}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cine-950 mb-3 cursor-pointer"
                      >
                        <CineImage
                          src={prod.posterUrl}
                          alt={prod.title}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                          fallbackTitle={prod.title}
                        />
                        {/* Format Badge */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          <span className="bg-cine-900/90 backdrop-blur-sm text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow border border-cine-700/60">
                            {prod.format}
                          </span>
                          {prod.isPreorder && (
                            <span className="bg-amber-400 text-cine-950 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow">
                              Preventa
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px] z-10"
                        >
                          <Eye className="w-4 h-4 text-amber-300" />
                          <span>Ficha Técnica</span>
                        </div>
                      </div>

                      {/* Movie Info */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span className="font-semibold text-cine-800">{prod.director}</span>
                          <span>{prod.year}</span>
                        </div>
                        <h4
                          onClick={() => handleOpenSpec(prod)}
                          className="font-serif font-black text-zinc-900 text-base leading-snug group-hover:text-cine-700 transition-colors cursor-pointer line-clamp-1"
                        >
                          {prod.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">
                          {prod.overview}
                        </p>
                      </div>
                    </div>

                    {/* Price & Add to Cart Button (matches the red button in the photo) */}
                    <div className="mt-4 pt-3 border-t border-parchment-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-sans">Precio COP</span>
                        <span className="text-lg font-serif font-black text-cine-900">
                          ${prod.price.toLocaleString("es-CO")}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            id: prod.id,
                            title: prod.title,
                            price: prod.price,
                            format: prod.format,
                            category: prod.category,
                            posterUrl: prod.posterUrl,
                          })
                        }
                        className="bg-cine-700 hover:bg-cine-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow hover:shadow-md flex items-center gap-1.5 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technical Spec Sheet Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
