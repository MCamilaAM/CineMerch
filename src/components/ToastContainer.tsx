"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismissToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border text-white flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-right ${
            toast.type === "success"
              ? "bg-cine-900 border-cine-700 text-zinc-100"
              : toast.type === "warning"
              ? "bg-amber-900 border-amber-700 text-amber-100"
              : "bg-zinc-900 border-zinc-700 text-zinc-200"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs">
            <h5 className="font-bold text-sm leading-tight text-white">{toast.title}</h5>
            <p className="mt-0.5 text-zinc-300 leading-snug">{toast.description}</p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
