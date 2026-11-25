// Google Analytics 4 (GA4) Tracker for CineMerch

const configuredId = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/.test(configuredId) && configuredId !== "G-CINEMERCH2026" ? configuredId : "";
export const analyticsPreference = "cinemerch_analytics_consent";
export const analyticsPreferenceEvent = "cinemerch:analytics_consent";

export function analyticsAllowed() {
  return typeof window !== "undefined" && localStorage.getItem(analyticsPreference) === "granted";
}

const sources: Readonly<Record<string, readonly string[]>> = {
  instagram: ["social"],
  tiktok: ["social"],
  whatsapp: ["messaging"],
  email: ["email"],
  google: ["cpc", "organic"],
};

function campaignAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source")?.toLowerCase();
  const medium = params.get("utm_medium")?.toLowerCase();
  if (source && medium && Object.prototype.hasOwnProperty.call(sources, source) && sources[source].includes(medium)) {
    const attribution = {
      campaign_source: source,
      campaign_medium: medium,
      campaign_name: params.get("utm_campaign") === "primeros_100" ? "primeros_100" : "cinemerch",
    };
    sessionStorage.setItem("cinemerch_campaign", JSON.stringify(attribution));
    return attribution;
  }
  try {
    return JSON.parse(sessionStorage.getItem("cinemerch_campaign") || "{}");
  } catch {
    return {};
  }
}

export interface GAEventItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
}

export interface GAEventPayload {
  currency?: string;
  value?: number;
  items?: GAEventItem[];
  [key: string]: any;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Dispatches an event to GA4 dataLayer and broadcasts to local inspector
 */
export function trackGAEvent(eventName: string, params: GAEventPayload = {}) {
  const timestamp = new Date().toLocaleTimeString();
  const enhancedParams = {
    ...campaignAttribution(),
    ...params,
    event_timestamp: timestamp,
  };

  // 1. Dispatch to official Google gtag if available
  if (typeof window !== "undefined" && typeof window.gtag === "function" && analyticsAllowed() && !window.location.pathname.startsWith("/admin")) {
    try {
      window.gtag("event", eventName, {
        ...enhancedParams,
        page_location: window.location.origin + window.location.pathname,
        page_referrer: "",
      });
    } catch (e) {
      console.warn("[GA4] Error pushing to window.gtag:", e);
    }
  }

  // 2. Dispatch custom browser event for our in-app real-time Analytics Debugger
  if (typeof window !== "undefined") {
    const customEvent = new CustomEvent("cinemerch:ga_event", {
      detail: {
        eventName,
        params: enhancedParams,
        timestamp,
      },
    });
    window.dispatchEvent(customEvent);
  }

  // 3. Log to console for developer observability
  if (process.env.NODE_ENV !== "production") {
    console.log(`%c[GA4 Event: ${eventName}]`, "color: #e11d48; font-weight: bold;", enhancedParams);
  }
}

// Pre-defined GA4 eCommerce & Marketing Event Helpers:

export function trackPageView(url: string, title?: string) {
  trackGAEvent("page_view", {
    page_location: typeof window === "undefined" ? url : window.location.origin + url,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
  });
}

export function trackViewItem(product: {
  id: string;
  title: string;
  category: string;
  price: number;
}) {
  trackGAEvent("view_item", {
    currency: "COP",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity?: number;
}) {
  const qty = product.quantity || 1;
  trackGAEvent("add_to_cart", {
    currency: "COP",
    value: product.price * qty,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category,
        price: product.price,
        quantity: qty,
      },
    ],
  });
}

export function trackRemoveFromCart(product: {
  id: string;
  title: string;
  price: number;
  quantity?: number;
}) {
  trackGAEvent("remove_from_cart", {
    currency: "COP",
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity || 1,
      },
    ],
  });
}

export function trackBeginCheckout(items: GAEventItem[], totalValue: number) {
  trackGAEvent("begin_checkout", {
    currency: "COP",
    value: totalValue,
    items,
  });
}

export function trackPurchase(order: {
  transaction_id: string;
  value: number;
  shipping: number;
  tax: number;
  coupon?: string;
  payment_type: string;
  items: GAEventItem[];
}) {
  trackGAEvent("purchase", {
    transaction_id: order.transaction_id,
    currency: "COP",
    value: order.value,
    shipping: order.shipping,
    tax: order.tax,
    ...(order.coupon && ["CINE10", "CINEMERCH10", "PREVENTA10"].includes(order.coupon) ? { coupon: order.coupon } : {}),
    payment_type: order.payment_type,
    items: order.items,
  });
}

export function trackLeadCapture() {
  trackGAEvent("generate_lead", { lead_type: "waitlist_primeros_100" });
}
