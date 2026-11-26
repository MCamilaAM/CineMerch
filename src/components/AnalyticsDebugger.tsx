"use client";

import React, { useState, useEffect } from "react";
import { Activity, CheckCircle2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { adminTokenChangedEvent, adminTokenKey, verifyAdminAccess } from "@/lib/admin-access";

interface CapturedEvent {
  id: string;
  eventName: string;
  params: any;
  timestamp: string;
}

export default function AnalyticsDebugger() {
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CapturedEvent | null>(null);
  const [canClear, setCanClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearError, setClearError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCanClear(false);
      return;
    }
    let controller: AbortController | undefined;
    const refreshAccess = () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      setCanClear(false);
      const token = sessionStorage.getItem(adminTokenKey) || "";
      void verifyAdminAccess(token, signal)
        .then((authorized) => {
          if (!signal.aborted && sessionStorage.getItem(adminTokenKey) === token) setCanClear(authorized);
        })
        .catch(() => {});
    };
    refreshAccess();
    window.addEventListener(adminTokenChangedEvent, refreshAccess);
    window.addEventListener("storage", refreshAccess);
    window.addEventListener("focus", refreshAccess);
    return () => {
      controller?.abort();
      window.removeEventListener(adminTokenChangedEvent, refreshAccess);
      window.removeEventListener("storage", refreshAccess);
      window.removeEventListener("focus", refreshAccess);
    };
  }, [isOpen]);

  async function clearEvents() {
    if (!canClear || isClearing) return;
    setIsClearing(true);
    setClearError("");
    try {
      const token = sessionStorage.getItem(adminTokenKey) || "";
      const authorized = await verifyAdminAccess(token);
      if (!authorized || sessionStorage.getItem(adminTokenKey) !== token) {
        throw new Error("Acceso administrativo requerido");
      }
      setEvents([]);
      setSelectedEvent(null);
    } catch {
      setCanClear(false);
      setClearError("No se pudo verificar el acceso administrativo. Los eventos se conservaron.");
    } finally {
      setIsClearing(false);
    }
  }

  useEffect(() => {
    const handleCustomGAEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail) return;
      const newEvent: CapturedEvent = {
        id: Math.random().toString(36).substring(2, 9),
        eventName: customEvent.detail.eventName,
        params: customEvent.detail.params,
        timestamp: customEvent.detail.timestamp || new Date().toLocaleTimeString(),
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 30));
    };

    window.addEventListener("cinemerch:ga_event", handleCustomGAEvent);
    return () => {
      window.removeEventListener("cinemerch:ga_event", handleCustomGAEvent);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-30 font-sans text-xs">
      {/* Trigger pill */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-cine-900/95 backdrop-blur-md text-amber-300 border border-cine-700/80 px-3.5 py-2 rounded-full shadow-2xl hover:bg-cine-950 transition-all hover:scale-105 active:scale-95"
          title="Ver registro en tiempo real de Google Analytics 4"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-[11px] tracking-wide text-zinc-100">
            Analítica local · <span className="text-amber-400">{events.length}</span> eventos
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1 text-zinc-400" /> : <ChevronUp className="w-3.5 h-3.5 ml-1 text-zinc-400" />}
        </button>
      </div>

      {/* Expanded Drawer / Modal */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 sm:w-96 bg-zinc-950/95 text-zinc-100 border border-cine-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 bg-gradient-to-r from-cine-950 via-cine-900 to-cine-950 border-b border-cine-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Embudo de CineMerch</h4>
                <p className="text-[10px] text-zinc-400 font-mono">{GA_MEASUREMENT_ID ? "GA4 opcional según consentimiento" : "Eventos de esta página"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canClear && <button
                onClick={() => void clearEvents()}
                disabled={isClearing}
                className="text-zinc-400 hover:text-red-400 p-1 disabled:opacity-50"
                title="Limpiar registro"
                aria-label="Limpiar registro"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>}
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white px-2 py-0.5 rounded text-xs bg-zinc-800"
              >
                Cerrar
              </button>
            </div>
          </div>

          {clearError && <p role="alert" className="px-3 py-2 text-[11px] text-amber-300">{clearError}</p>}
          <div className="grid grid-cols-3 gap-2 border-b border-zinc-800 p-3 text-[10px]">
            {([["generate_lead", "Registros"], ["begin_checkout", "Checkouts"], ["purchase", "Aprobados"]] as const).map(([name, label]) => (
              <span key={name}>{label} <strong className="text-amber-300">{events.filter((event) => event.eventName === name).length}</strong></span>
            ))}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-zinc-900 p-2 space-y-1">
            {events.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-[11px]">
                Navega por la página, abre productos o usa el carrito para ver los eventos de la demo.
              </div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(selectedEvent?.id === evt.id ? null : evt)}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedEvent?.id === evt.id ? "bg-cine-900/50 border border-cine-700/50" : "hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-emerald-400 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {evt.eventName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{evt.timestamp}</span>
                  </div>

                  {/* Quick summary line */}
                  <div className="mt-1 text-[10px] text-zinc-400 truncate">
                    {evt.params.item_name && `Producto: ${evt.params.item_name}`}
                    {evt.params.value && ` | Valor: $${Number(evt.params.value).toLocaleString("es-CO")} COP`}
                    {evt.params.lead_type && " · Registro de interés"}
                  </div>

                  {/* Expanded JSON details */}
                  {selectedEvent?.id === evt.id && (
                    <pre className="mt-2 p-2 bg-black/80 rounded border border-zinc-800 text-[10px] font-mono text-amber-200/90 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(evt.params, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="p-2 bg-zinc-900/60 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex justify-between items-center px-3">
            <span>Sincronizado con dataLayer</span>
            <span className="text-emerald-400 font-medium">Estado: Activo</span>
          </div>
        </div>
      )}
    </div>
  );
}
