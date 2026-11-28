"use client";

import { useRef, useState, type FormEvent } from "react";
import { isReceiptFilename, maxReceiptBytes } from "@/lib/payment-receipt";
import { paymentMethods } from "@/lib/checkout-options";
import type { PaymentAttempt } from "./SimulatedWompiGateway";

export default function PaymentReceiptUpload({ orderId, token, transaction, onUploaded }: {
  orderId: string;
  token: string;
  transaction: PaymentAttempt;
  onUploaded: (transaction: PaymentAttempt) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const methodLabel = paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    if (!file || !isReceiptFilename(file.name) || (file.type && file.type !== "image/jpeg")) {
      setError("Selecciona una imagen JPG (.jpg o .jpeg).");
      return;
    }
    if (!file.size || file.size > maxReceiptBytes) {
      setError("El comprobante debe pesar entre 1 byte y 5 MB.");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("receipt", file);
      form.append("transactionId", transaction.id);
      const response = await fetch(`/api/orders/${orderId}/payment-receipt`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "No se pudo subir el comprobante.");
      onUploaded(result.transaction);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error de conexión al subir el comprobante.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (transaction.receiptUploadedAt) return (
    <p role="status" className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-200">
      Comprobante recibido. Tu pago por {methodLabel} está pendiente de revisión por el administrador.
    </p>
  );

  return (
    <form onSubmit={submit} aria-busy={busy} className="space-y-3 rounded-xl border border-amber-700 bg-cine-950 p-4">
      <h4 className="font-serif text-lg font-bold text-amber-300">Comprobante de pago {methodLabel}</h4>
      <p id="receipt-help" className="text-sm text-zinc-300">Sube una imagen JPG para enviar tu pago a revisión. Este paso es obligatorio.</p>
      <label className="grid gap-2 text-sm">Comprobante JPG
        <input type="file" accept=".jpg,.jpeg,image/jpeg" required disabled={busy}
          aria-describedby="receipt-help receipt-limit" onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
          }} className="w-full min-w-0 rounded-lg border border-zinc-600 p-2 file:mr-2 file:rounded-lg file:border-0 file:bg-amber-400 file:p-2 file:font-bold file:text-cine-950" />
      </label>
      <p id="receipt-limit" className="text-xs text-zinc-300">Formato .jpg o .jpeg. Máximo 5 MB.</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button type="submit" disabled={busy || !file}
        className="min-h-11 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-cine-950 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:opacity-50">
        {busy ? "Subiendo comprobante…" : "Enviar comprobante"}
      </button>
    </form>
  );
}
