"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Search,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  Film,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"kpis" | "orders" | "products" | "leads">("kpis");
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form states
  const [tmdbIdInput, setTmdbIdInput] = useState("");
  const [isFetchingTMDB, setIsFetchingTMDB] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDirector, setNewDirector] = useState("");
  const [newYear, setNewYear] = useState("2024");
  const [newPrice, setNewPrice] = useState("179000");
  const [newFormat, setNewFormat] = useState("Steelbook");
  const [newCategory, setNewCategory] = useState("Drama");
  const [newOverview, setNewOverview] = useState("");
  const [newPosterUrl, setNewPosterUrl] = useState("");
  const [newStock, setNewStock] = useState("15");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [ordersMessage, setOrdersMessage] = useState("Consultando órdenes…");
  const requestVersion = React.useRef(0);

  const fetchData = async (accessToken = token) => {
    const version = ++requestVersion.current;
    const headers = { Authorization: "Bearer " + accessToken };
    setAdminError("");
    setOrdersMessage("Consultando órdenes…");
    setLoading(true);
    try {
      const [resOrders, resLeads, resProds] = await Promise.all([
        fetch("/api/orders", { headers }),
        fetch("/api/waitlist", { headers }),
        fetch("/api/products"),
      ]);

      const dataOrders = await resOrders.json();
      const dataLeads = await resLeads.json();
      const dataProds = await resProds.json();

      if (version !== requestVersion.current) return;
      setOrders(dataOrders.success ? dataOrders.orders : []);
      setLeads(dataOrders.success && dataLeads.success ? dataLeads.leads : []);
      if (resOrders.status === 401) {
        setOrdersMessage(accessToken
          ? "El token administrativo no es válido. Copia el valor de ADMIN_ACCESS_TOKEN de .env.local y vuelve a aplicarlo."
          : "Para ver las órdenes guardadas, aplica el token administrativo de .env.local.");
      } else if (!resOrders.ok || !dataOrders.success) {
        setOrdersMessage(dataOrders.error || "No se pudieron consultar las órdenes.");
      } else {
        setOrdersMessage("Aún no se han registrado órdenes.");
      }
      if (dataProds.success) setProducts(dataProds.products);
    } catch (e) {
      if (version === requestVersion.current) {
        setOrders([]);
        setLeads([]);
        setOrdersMessage("No se pudieron consultar las órdenes. Usa Actualizar Datos para reintentar.");
        setAdminError("No se pudieron consultar los datos administrativos.");
      }
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("cinemerch_admin_token") || "";
    setToken(saved);
    void fetchData(saved);
  }, []);

  // TMDB Autocomplete Handler (US-05)
  const handleFetchTMDB = async () => {
    if (!tmdbIdInput.trim()) {
      alert("Por favor ingresa un ID de TMDB (ej. 872585 para Oppenheimer o 680 para Pulp Fiction)");
      return;
    }

    setIsFetchingTMDB(true);
    try {
      const res = await fetch(`/api/tmdb/search?id=${encodeURIComponent(tmdbIdInput.trim())}`);
      const data = await res.json();
      if (data.success && data.movie) {
        setNewTitle(data.movie.title);
        setNewDirector(data.movie.director);
        setNewYear(String(data.movie.year));
        setNewOverview(data.movie.overview);
        setNewPosterUrl(data.movie.posterUrl);
      } else {
        alert("No se encontraron metadatos para ese ID.");
      }
    } catch (err) {
      alert("Error al conectar con TMDB.");
    } finally {
      setIsFetchingTMDB(false);
    }
  };

  // Create Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          title: newTitle,
          tmdbId: tmdbIdInput ? Number(tmdbIdInput) : null,
          director: newDirector,
          year: Number(newYear),
          price: Number(newPrice),
          format: newFormat,
          category: newCategory,
          overview: newOverview,
          posterUrl: newPosterUrl,
          stock: Number(newStock),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`¡Producto "${newTitle}" añadido exitosamente al catálogo!`);
        setNewTitle("");
        setTmdbIdInput("");
        setNewDirector("");
        setNewOverview("");
        setNewPosterUrl("");
        fetchData();
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        setAdminError(data.error || "No se pudo guardar el producto.");
      }
    } catch (err) {
      alert("Error al guardar producto.");
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        if (res.status === 401) {
          setOrders([]);
          setLeads([]);
          setOrdersMessage("Vuelve a aplicar el token administrativo para ver las órdenes.");
        }
        setAdminError(data.error || "No se pudo actualizar el pedido.");
      }
    } catch (e) {
      setAdminError("Error actualizando orden.");
    }
  };

  // Calculations for KPIs
  const approved = orders.filter((order) => order.paymentStatus === "APPROVED");
  const pending = orders.filter((order) => order.paymentStatus === "PENDING");
  const failed = orders.filter((order) => ["DECLINED", "ERROR"].includes(order.paymentStatus));
  const totalSalesCOP = approved.reduce((acc, o) => acc + o.total, 0);
  const averageTicketCOP = approved.length ? Math.round(totalSalesCOP / approved.length) : 0;

  // Export Leads to CSV (US-20)
  const exportLeadsCSV = () => {
    const headers = "Nombre,Correo,WhatsApp,Cupon,Fecha\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.fullName}","${l.email}","${l.phone}","${l.couponCode}","${new Date(
            l.createdAt
          ).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CineMerch_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 px-4 sm:px-8 bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Film className="w-4 h-4" />
              <span>CineMerch • Panel Administrativo & Auditoría</span>
            </div>
            <h1 className="text-3xl font-serif font-black text-white">
              Centro de Control de Operaciones
            </h1>
            <p className="text-xs text-zinc-400">
              Pagos de simulación, gestión de pedidos y catálogo sincronizado con TMDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void fetchData()}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Actualizar Datos</span>
            </button>
          </div>
        </div>

        <form className="flex flex-wrap items-end gap-2 px-4 pb-3" onSubmit={(event) => {
        event.preventDefault();
        const value = tokenInput.trim();
        if (value) sessionStorage.setItem("cinemerch_admin_token", value);
        else sessionStorage.removeItem("cinemerch_admin_token");
        setOrders([]);
        setLeads([]);
        setToken(value);
        setTokenInput("");
        void fetchData(value);
      }}>
        <label className="grid gap-1 text-sm">Token administrativo
          <input type="password" autoComplete="off" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)}
            placeholder="Valor de ADMIN_ACCESS_TOKEN" aria-describedby="admin-token-help"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2" />
        </label>
        <button className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-zinc-950">Aplicar token</button>
        <p id="admin-token-help" className="basis-full text-xs text-zinc-400">El token está en el archivo local <code>.env.local</code>.</p>
      </form>
      {adminError && <p role="alert" className="px-4 pb-3 text-rose-300">{adminError}</p>}

      {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("kpis")}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === "kpis" ? "bg-amber-400 text-cine-950 shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            Métricas & Rendimiento
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "orders" ? "bg-amber-400 text-cine-950 shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Órdenes de Compra</span>
            <span className="bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "products" ? "bg-amber-400 text-cine-950 shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Alta de Productos (TMDB)</span>
            <span className="bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "leads" ? "bg-amber-400 text-cine-950 shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Primeros 100 Cinéfilos (Leads)</span>
            <span className="bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {leads.length}
            </span>
          </button>
        </div>

        {/* TAB 1: KPIS & METRICS */}
        {activeTab === "kpis" && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Ventas cobradas · COP</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif font-black text-emerald-400">
                  ${totalSalesCOP.toLocaleString("es-CO")}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Importe de pedidos aprobados en la simulación</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Ticket Promedio</span>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-serif font-black text-amber-300">
                  ${averageTicketCOP.toLocaleString("es-CO")}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Meta del Plan de Marketing: $150.000 COP</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Pedidos Totales</span>
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-serif font-black text-white">
                  {orders.length}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">{approved.length} aprobados · {pending.length} pendientes · {failed.length} rechazados o con error</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>Leads "100 Cinéfilos"</span>
                  <Users className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-serif font-black text-rose-300">
                  {leads.length} / 100
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {Math.max(0, 100 - leads.length)} cupos restantes
                </p>
              </div>
            </div>

            {/* Strategic Overview Table from Marketing Plan */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-3">
              <h3 className="font-serif font-black text-base text-white">
                Monitoreo del Embudo (Plan de Marketing CineMerch)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/80">
                  <h4 className="font-bold text-amber-300 mb-1">1. Adquisición (CAC & Leads)</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Campaña "Primeros 100 Cinéfilos" con captura de WhatsApp y correo. Los eventos están siendo monitoreados en Google Analytics 4 mediante el evento <code className="text-emerald-400 font-mono">lead_capture</code>.
                  </p>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/80">
                  <h4 className="font-bold text-amber-300 mb-1">2. Conversión & Pasarela Wompi</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Reducción de fricción soportando el 85.3% de preferencia de pago digital (Nequi, Bancolombia, Bre-B, tarjetas) y opción local contraentrega en Cartagena. Evento GA4 <code className="text-emerald-400 font-mono">purchase</code>.
                  </p>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/80">
                  <h4 className="font-bold text-amber-300 mb-1">3. Fidelización & Recompra (90 Días)</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Rangos Extra, Reparto, Protagonista y Director. Acumulación automática de 1 pt por cada $1.000 COP y redención de hasta el 30% en pedidos posteriores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-white">
                Registro de Pedidos Recibidos ({orders.length})
              </h3>
              <span className="text-xs text-zinc-400">Actualización en tiempo real</span>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Orden</th>
                      <th className="p-4">Cliente / Contacto</th>
                      <th className="p-4">Ciudad / Destino</th>
                      <th className="p-4">Método de Pago</th>
                      <th className="p-4">Total COP</th>
                      <th className="p-4">Transportadora & Guía</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500">
                          <span role="status">{ordersMessage}</span>
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-amber-300">
                            {ord.orderNumber}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{ord.customerName}</div>
                            <div className="text-[10px] text-zinc-400">{ord.customerEmail}</div>
                            <div className="text-[10px] text-zinc-400">{ord.customerPhone}</div>
                          </td>
                          <td className="p-4">
                            <div>{ord.city}</div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{ord.address}</div>
                          </td>
                          <td className="p-4">
                            <span className="bg-black/60 px-2 py-0.5 rounded border border-zinc-700 font-mono text-[10px]">
                              {ord.paymentMethod}
                            </span>
                            <div>{ord.paymentStatus}</div>
                            <div className="max-w-48 break-all text-[10px] text-zinc-400">{ord.transaction?.reference || "Sin referencia"}</div>
                            {ord.transaction && <time className="text-[10px] text-zinc-400">{new Date(ord.transaction.createdAt).toLocaleString("es-CO")}</time>}
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            ${ord.total.toLocaleString("es-CO")}
                          </td>
                          <td className="p-4 text-[11px]">
                            <div className="text-zinc-200">{ord.carrier || "Sin asignar"}</div>
                            <div className="font-mono text-[10px] text-amber-400">{ord.trackingNumber}</div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                ord.status === "PAGADO"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                                  : ord.status === "ENVIADO"
                                  ? "bg-sky-950 text-sky-400 border border-sky-700"
                                  : ord.status === "ENTREGADO"
                                  ? "bg-purple-950 text-purple-400 border border-purple-700"
                                  : "bg-amber-950 text-amber-400 border border-amber-700"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value=""
                              aria-label="Cambiar estado logístico"
                              disabled={ord.paymentStatus !== "APPROVED" || !["PAGADO", "ENVIADO"].includes(ord.status)}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-black border border-zinc-700 text-zinc-200 text-[11px] p-1 rounded-lg focus:outline-none"
                            >
                              <option value="">Seleccionar</option>
                              {ord.paymentStatus === "APPROVED" && ord.status === "PAGADO" && <option value="ENVIADO">ENVIADO</option>}
                              {ord.paymentStatus === "APPROVED" && ord.status === "ENVIADO" && <option value="ENTREGADO">ENTREGADO</option>}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG CREATION WITH TMDB AUTOCOMPLETE (US-05) */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl">
              <div className="max-w-2xl">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider bg-cine-950 px-2.5 py-1 rounded-full border border-cine-700">
                  Integración TMDB API v3 (US-05)
                </span>
                <h3 className="text-2xl font-serif font-black text-white mt-2">
                  Dar de Alta un Producto con Metadatos Oficiales
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ingresa el ID de The Movie Database (TMDB) para autocompletar automáticamente título, director, sinopsis, año y póster en alta resolución.
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="mt-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TMDB Fetcher Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 w-full relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="ID de película en TMDB (ej. 872585 Oppenheimer, 680 Pulp Fiction, 693134 Dune 2)"
                    value={tmdbIdInput}
                    onChange={(e) => setTmdbIdInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  disabled={isFetchingTMDB}
                  onClick={handleFetchTMDB}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-cine-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isFetchingTMDB ? "Consultando..." : "Autocompletar con TMDB"}</span>
                </button>
              </div>

              {/* Product Form */}
              <form onSubmit={handleCreateProduct} className="mt-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-semibold">Título del Producto *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ej. Oppenheimer - Steelbook 4K UHD"
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Director *</label>
                    <input
                      type="text"
                      required
                      value={newDirector}
                      onChange={(e) => setNewDirector(e.target.value)}
                      placeholder="Ej. Christopher Nolan"
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Precio en COP *</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Formato Físico</label>
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Steelbook">Steelbook Metálico</option>
                      <option value="4K UHD">4K Ultra HD Estándar</option>
                      <option value="Box Set">Box Set Colección</option>
                      <option value="Kit">Kit Temático</option>
                      <option value="Merch">Merch / Accesorio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Género</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Drama">Drama</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Acción">Acción</option>
                      <option value="Terror">Terror</option>
                      <option value="Kits">Kits</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-semibold">Inventario (Stock)</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">URL del Póster (Alta Resolución)</label>
                  <input
                    type="url"
                    value={newPosterUrl}
                    onChange={(e) => setNewPosterUrl(e.target.value)}
                    placeholder="https://image.tmdb.org/t/p/w780/..."
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Sinopsis & Especificaciones</label>
                  <textarea
                    rows={3}
                    value={newOverview}
                    onChange={(e) => setNewOverview(e.target.value)}
                    placeholder="Descripción de la edición, pistas de audio, subtítulos..."
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-cine-950 font-black px-6 py-3 rounded-xl transition-all shadow text-xs flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Producto en CineMerch</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: WAITLIST LEADS TABLE (US-02, US-20) */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-black text-lg text-white">
                  Lista de Espera "Primeros 100 Cinéfilos" ({leads.length} registrados)
                </h3>
                <p className="text-xs text-zinc-400">
                  Cupones de preventa emitidos con 10% de descuento de bienvenida.
                </p>
              </div>

              <button
                onClick={exportLeadsCSV}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Leads a CSV (Excel)</span>
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">#</th>
                      <th className="p-4">Nombre Completo</th>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4">WhatsApp (Colombia)</th>
                      <th className="p-4">Cupón Asignado</th>
                      <th className="p-4">Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          No hay leads registrados aún.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead, idx) => (
                        <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4 font-mono text-zinc-500">{idx + 1}</td>
                          <td className="p-4 font-bold text-white">{lead.fullName}</td>
                          <td className="p-4">{lead.email}</td>
                          <td className="p-4 font-mono text-amber-300">{lead.phone}</td>
                          <td className="p-4">
                            <span className="bg-black/60 px-2 py-0.5 rounded border border-amber-500/50 font-mono text-amber-400 text-[11px] font-bold">
                              {lead.couponCode}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-400">
                            {new Date(lead.createdAt).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
