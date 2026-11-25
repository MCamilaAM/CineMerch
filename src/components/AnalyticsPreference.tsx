"use client";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID, analyticsPreference, analyticsPreferenceEvent, analyticsAllowed } from "@/lib/analytics";

export default function AnalyticsPreference() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(analyticsAllowed()), []);
  if (!GA_MEASUREMENT_ID) return <p>Esta copia usa el monitor local. No hay una propiedad GA4 configurada.</p>;
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={enabled} onChange={(event) => {
        const allowed = event.target.checked;
        localStorage.setItem(analyticsPreference, allowed ? "granted" : "denied");
        window.dispatchEvent(new Event(analyticsPreferenceEvent));
        setEnabled(allowed);
      }} />
      Permitir analítica externa con Google Analytics
    </label>
  );
}
