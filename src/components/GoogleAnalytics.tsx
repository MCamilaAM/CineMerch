"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, analyticsAllowed, analyticsPreferenceEvent, trackPageView } from "@/lib/analytics";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function update() {
      const allowed = Boolean(GA_MEASUREMENT_ID) && analyticsAllowed();
      Reflect.set(window, "ga-disable-" + GA_MEASUREMENT_ID, !allowed);
      setEnabled(allowed);
    }
    update();
    window.addEventListener(analyticsPreferenceEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(analyticsPreferenceEvent, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    if (pathname && (ready || !enabled) && !pathname.startsWith("/admin")) trackPageView(pathname);
  }, [pathname, enabled, ready]);

  if (!enabled) return null;
  return (
    <Script id="cinemerch-ga4" src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID}
      strategy="afterInteractive" onReady={() => {
        if (!analyticsAllowed()) return;
        if (!window.gtag) {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer?.push(arguments); };
          window.gtag("js", new Date());
          window.gtag("config", GA_MEASUREMENT_ID, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            page_location: window.location.origin + window.location.pathname,
            page_referrer: "",
          });
        }
        setReady(true);
      }} />
  );
}
