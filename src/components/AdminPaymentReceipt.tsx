"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentReceipt({ orderId, token }: { orderId: string; token: string }) {
  const [preview, setPreview] = useState<{ url?: string; error?: string }>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    let url: string | undefined;
    void (async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/payment-receipt`, {
          headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudo consultar el comprobante. Comprueba tu acceso administrativo.");
        const image = await response.blob();
        if (controller.signal.aborted) return;
        url = URL.createObjectURL(image);
        setPreview({ url });
      } catch (error) {
        if (!controller.signal.aborted) setPreview({ error: error instanceof Error ? error.message : "Error al consultar el comprobante." });
      }
    })();
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [open, orderId, token]);

  return (
    <div className="mt-3 space-y-2">
      <button type="button" aria-expanded={open} onClick={() => { setPreview({}); setOpen(!open); }}
        className="min-h-11 rounded-lg border border-amber-500 px-3 py-2 text-sm font-semibold text-amber-300 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
        {open ? "Ocultar comprobante" : "Ver comprobante"}
      </button>
      {open && (preview.url ? (
        // The private image is fetched with authorization and displayed locally.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview.url} alt="Comprobante de pago Bre-B" className="h-auto w-56 max-w-full rounded-lg" />
      ) : preview.error ? <p role="alert" className="max-w-56 text-xs text-rose-300">{preview.error}</p>
        : <p role="status">Cargando comprobante…</p>)}
    </div>
  );
}
