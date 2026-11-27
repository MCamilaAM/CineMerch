"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  GA_MEASUREMENT_ID, GTM_CONTAINER_ID, externalAnalyticsConfigured, analyticsAllowed,
  analyticsPreferenceEvent, sendExternalAnalyticsEvent, trackPageView,
} from "@/lib/analytics";
import { loadGoogleTag } from "@/lib/google-tag";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const previouslyAllowed = useRef(false);
  const configuredDirectGA = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    function update() {
      const publicPage = Boolean(pathname) && !pathname.startsWith("/admin");
      const allowed = externalAnalyticsConfigured && analyticsAllowed() && publicPage;
      window.gtag?.("consent", "update", {
        analytics_storage: allowed ? "granted" : "denied",
        ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      });
      if (GA_MEASUREMENT_ID) Reflect.set(window, "ga-disable-" + GA_MEASUREMENT_ID, !allowed);
      if (allowed) {
        if (!started.current) {
          // Apply the analytics preference before initializing the first view.
          window.gtag?.("js", new Date());
          started.current = true;
        }
        if (!GTM_CONTAINER_ID && !configuredDirectGA.current) {
          window.gtag?.("config", GA_MEASUREMENT_ID, {
            send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
            page_location: window.location.origin + window.location.pathname, page_referrer: "",
          });
          configuredDirectGA.current = true;
        }
        loadGoogleTag();
      }
      if (pathname !== lastPath.current) {
        lastPath.current = pathname;
        if (publicPage) trackPageView(pathname);
      } else if (allowed && !previouslyAllowed.current) {
        // Opt-in reports the current page without duplicating its local event.
        sendExternalAnalyticsEvent("page_view", { page_title: document.title });
      }
      previouslyAllowed.current = allowed;
    }
    update();
    window.addEventListener(analyticsPreferenceEvent, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(analyticsPreferenceEvent, update);
      window.removeEventListener("storage", update);
    };
  }, [pathname]);

  return null;
}
