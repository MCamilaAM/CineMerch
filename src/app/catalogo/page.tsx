"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Disc, Star, Sparkles, ShoppingBag, Eye, SlidersHorizontal } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductModal, { MovieProduct } from "@/components/ProductModal";
import CineImage from "@/components/CineImage";
import { trackViewItem } from "@/lib/analytics";

export default function CatalogoPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<MovieProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedDirector, setSelectedDirector] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<MovieProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        let url = `/api/products?`;
        if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
        if (selectedFormat !== "Todos") url += `format=${encodeURIComponent(selectedFormat)}&`;
        if (selectedCategory !== "Todos") url += `category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedDirector !== "Todos") url += `director=${encodeURIComponent(selectedDirector)}&`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error("Error loading catalog", e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchCatalog();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFormat, selectedCategory, selectedDirector]);

  const formats = ["Todos", "Steelbook", "4K UHD", "Box Set", "Kit", "Merch"];
  const categories = ["Todos", "Sci-Fi", "Drama", "Acción", "Terror", "Kits", "Accesorios"];
  const directors = [
    "Todos",
    "Christopher Nolan",
    "Quentin Tarantino",
    "Denis Villeneuve",
    "Stanley Kubrick",
    "Francis Ford Coppola",
    "Ridley Scott",
  ];

  return (
    <div className="py-10 px-4 sm:px-8 bg-parchment-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-cine-900 text-white rounded-3xl p-8 border border-cine-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider bg-cine-950/80 px-3 py-1 rounded-full border border-cine-700">
              Curaduría Cinematográfica Oficial
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black mt-3 leading-tight">
              Catálogo 4K Ultra HD & Steelbooks
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-light">
              Explora y filtra por director de culto, formatos de audio sin pérdidas (Dolby Atmos / DTS-HD) y ediciones especiales para coleccionistas.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white p-5 rounded-3xl border border-parchment-200 shadow-sm space-y-4">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por título de película, director (ej. Nolan), actor o estudio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-parchment-50 border border-parchment-300 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-cine-700"
            />
          </div>

          {/* Facets / Filter buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Format Filter */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1">Formato Físico:</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-parchment-50 border border-parchment-300 text-zinc-800 font-medium focus:outline-none focus:border-cine-700"
              >
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1">Género Cinematográfico:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-parchment-50 border border-parchment-300 text-zinc-800 font-medium focus:outline-none focus:border-cine-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Director Filter */}
            <div>
              <label className="block text-zinc-500 font-bold mb-1">Director de Culto:</label>
              <select
                value={selectedDirector}
                onChange={(e) => setSelectedDirector(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-parchment-50 border border-parchment-300 text-zinc-800 font-medium focus:outline-none focus:border-cine-700"
              >
                {directors.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-600">
              Mostrando {products.length} ediciones de cine
            </span>
            {(selectedFormat !== "Todos" || selectedCategory !== "Todos" || selectedDirector !== "Todos" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFormat("Todos");
                  setSelectedCategory("Todos");
                  setSelectedDirector("Todos");
                  setSearchQuery("");
                }}
                className="text-xs text-cine-700 font-bold hover:underline"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-4 h-96 animate-pulse border border-parchment-200"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-parchment-300 p-8">
              <Disc className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
              <h3 className="font-serif font-bold text-lg text-zinc-800">No encontramos coincidencias</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Intenta ajustando los términos de búsqueda o directores seleccionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-white rounded-3xl p-3.5 border border-parchment-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Poster */}
                    <div
                      onClick={() => {
                        setSelectedProduct(prod);
                        trackViewItem({
                          id: prod.id,
                          title: prod.title,
                          category: prod.category,
                          price: prod.price,
                        });
                      }}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cine-950 mb-3 cursor-pointer"
                    >
                      <CineImage
                        src={prod.posterUrl}
                        alt={prod.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                        fallbackTitle={prod.title}
                      />
                      <span className="absolute top-2 left-2 bg-cine-900/90 text-white font-black text-[9px] px-2 py-0.5 rounded shadow z-10">
                        {prod.format}
                      </span>
                      {prod.isPreorder && (
                        <span className="absolute bottom-2 left-2 bg-amber-400 text-cine-950 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow z-10">
                          Preventa
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 z-10">
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span>Ficha Técnica</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="font-semibold text-cine-700">{prod.director}</span>
                        <span>{prod.year}</span>
                      </div>
                      <h4
                        onClick={() => {
                          setSelectedProduct(prod);
                          trackViewItem({
                            id: prod.id,
                            title: prod.title,
                            category: prod.category,
                            price: prod.price,
                          });
                        }}
                        className="font-serif font-black text-zinc-900 text-sm leading-snug group-hover:text-cine-800 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 line-clamp-2">{prod.overview}</p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-3 pt-2.5 border-t border-parchment-100 flex items-center justify-between">
                    <span className="font-serif font-black text-base text-cine-900">
                      ${prod.price.toLocaleString("es-CO")} COP
                    </span>
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
                      className="bg-cine-700 hover:bg-cine-800 text-white font-bold text-xs p-2 rounded-xl transition-all shadow active:scale-95"
                      title="Agregar al carrito"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
