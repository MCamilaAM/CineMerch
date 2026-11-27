import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { googleTagBootstrap, loadGoogleTag } from "../src/lib/google-tag";
import { sendExternalAnalyticsEvent, trackPurchase, analyticsPreference, GA_MEASUREMENT_ID } from "../src/lib/analytics";

function withBrowser(check: (browser: any) => void) {
  const keys = ["window", "document", "localStorage", "sessionStorage"] as const;
  const previous = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const saved = new Map<string, string>();
  const storage = { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => saved.set(key, value) };
  const scripts: any[] = [];
  const calls: unknown[][] = [];
  const browser = {
    location: { origin: "https://cinemerch.example", pathname: "/catalogo", search: "?email=privado@example.test" },
    dataLayer: [] as any[], gtag: (...args: unknown[]) => calls.push(args), dispatchEvent: () => true,
  };
  const document = {
    getElementById: (id: string) => scripts.find((script) => script.id === id),
    createElement: () => ({}), head: { appendChild: (script: any) => scripts.push(script) },
  };
  try {
    for (const [key, value] of Object.entries({ window: browser, document, localStorage: storage, sessionStorage: storage })) {
      Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    }
    check({ browser, storage, scripts, calls });
  } finally {
    for (const key of keys) {
      const descriptor = previous.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test("la cabecera inicializa dataLayer y deniega consentimiento antes de iniciar Google", () => {
  const context: any = { Date };
  context.window = context;
  runInNewContext(googleTagBootstrap, context);
  const [consent] = context.dataLayer.map((entry: IArguments) => Array.from(entry));
  assert.deepEqual(consent.slice(0, 2), ["consent", "default"]);
  assert.equal(consent[2].analytics_storage, "denied");
  assert.equal(consent[2].ad_storage, "denied");
  assert.equal(consent[2].ad_user_data, "denied");
  assert.equal(consent[2].ad_personalization, "denied");
  assert.equal(context.dataLayer.length, 1, "Google no debe iniciarse antes de autorizar");
});

test("el contenedor de la imagen se agrega una sola vez, asíncrono y en head", () => {
  withBrowser(({ scripts }) => {
    loadGoogleTag();
    loadGoogleTag();
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].async, true);
    assert.equal(scripts[0].src, "https://www.googletagmanager.com/gtm.js?id=GTM-T6QZZ4X9");
  });
});

test("no se encolan eventos externos sin consentimiento ni desde admin", () => {
  withBrowser(({ browser, storage, calls }) => {
    sendExternalAnalyticsEvent("add_to_cart", { value: 1000 });
    assert.equal(browser.dataLayer.length, 0);
    storage.setItem(analyticsPreference, "granted");
    browser.location.pathname = "/admin";
    sendExternalAnalyticsEvent("purchase", { value: 1000 });
    assert.equal(browser.dataLayer.length, 0);
    browser.location.pathname = "/catalogo";
    storage.setItem(analyticsPreference, "denied");
    sendExternalAnalyticsEvent("add_to_cart", { value: 1000 });
    assert.equal(browser.dataLayer.length, 0);
    assert.equal(calls.length, 0);
  });
});

test("los eventos se envían una vez por la API de Google, al destino configurado", () => {
  withBrowser(({ browser, storage, calls }) => {
    storage.setItem(analyticsPreference, "granted");
    sendExternalAnalyticsEvent("add_to_cart", { value: 1000, currency: "COP" });
    assert.equal(browser.dataLayer.length, 0, "No duplicar como evento personalizado GTM");
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "event");
    assert.equal(calls[0][1], "add_to_cart");
    assert.equal(calls[0][2].value, 1000);
    assert.equal(calls[0][2].send_to, GA_MEASUREMENT_ID || undefined);
    assert.equal(calls[0][2].page_location, "https://cinemerch.example/catalogo");
    assert.equal(calls[0][2].page_referrer, "");
    assert.equal(JSON.stringify(calls).includes("privado@example.test"), false);
  });
});

test("las compras mantienen sus importes y excluyen los cupones individuales", () => {
  withBrowser(({ storage, calls }) => {
    storage.setItem(analyticsPreference, "granted");
    trackPurchase({ transaction_id: "prueba", value: 1000, shipping: 0, tax: 160,
      coupon: "CINEMERCH10-PRIVADO", payment_type: "WOMPI_NEQUI", items: [],
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][1], "purchase");
    assert.equal(calls[0][2].currency, "COP");
    assert.equal(calls[0][2].value, 1000);
    assert.equal(calls[0][2].coupon, undefined);
  });
});

test("GTM conserva las vistas automáticas sin añadir otra vista manual", () => {
  withBrowser(({ browser, storage, calls }) => {
    storage.setItem(analyticsPreference, "granted");
    sendExternalAnalyticsEvent("page_view");
    assert.equal(calls.length, 0);
    assert.equal(browser.dataLayer.length, 0);
  });
});
