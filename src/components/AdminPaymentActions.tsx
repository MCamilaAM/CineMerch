"use client";

import { useRef, useState } from "react";

const actions = {
  APPROVED: "Aprobar",
  DECLINED: "Cancelar",
  PENDING: "Dejar pendiente",
};

export default function AdminPaymentActions({ transactionId, token, approvalBlocked = false, onUpdated }: {
  transactionId: string;
  token: string;
  approvalBlocked?: boolean;
  onUpdated: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  async function updatePayment(scenario: keyof typeof actions) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/wompi/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ transactionId, scenario }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        if (response.status === 401) await onUpdated();
        throw new Error(result.error || "No se pudo actualizar el pago.");
      }
      await onUpdated();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error de conexión al actualizar el pago.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <div role="group" aria-label="Administrar pago" aria-busy={busy} className="flex flex-col gap-2">
        {(Object.keys(actions) as (keyof typeof actions)[]).map((scenario) => (
          <button key={scenario} type="button" disabled={busy || !token || (scenario === "APPROVED" && approvalBlocked)} onClick={() => void updatePayment(scenario)}
            className="min-h-11 rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-cine-950 hover:bg-amber-300 active:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:opacity-50">
            {actions[scenario]}
          </button>
        ))}
      </div>
      {approvalBlocked && <p className="max-w-56 text-xs text-amber-200">Falta el comprobante JPG para aprobar el pago por Bre-B.</p>}
      {busy && <p role="status" className="text-xs text-zinc-300">Actualizando pago…</p>}
      {error && <p role="alert" className="max-w-56 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
