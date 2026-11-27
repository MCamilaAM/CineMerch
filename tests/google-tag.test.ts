import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { googleTagBootstrap, loadGoogleTag } from "../src/lib/google-tag";
import { sendExternalAnalyticsEvent, trackPurchase, analyticsPreference } from "../src/lib/analytics";

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
  const [consent, start] = context.dataLayer.map((entry: IArguments) => Array.from(entry));
  assert.deepEqual(consent.slice(0, 2), ["consent", "default"]);
  assert.equal(consent[2].analytics_storage, "denied");
  assert.equal(consent[2].ad_storage, "denied");
  assert.equal(consent[2].ad_user_data, "denied");
  assert.equal(consent[2].ad_personalization, "denied");
  assert.equal(start[0], "js");
  assert.ok(start[1] instanceof Date);
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
  withBrowser(({ browser, storage }) => {
    sendExternalAnalyticsEvent("page_view");
    assert.equal(browser.dataLayer.length, 0);
    storage.setItem(analyticsPreference, "granted");
    browser.location.pathname = "/admin";
    sendExternalAnalyticsEvent("page_view");
    assert.equal(browser.dataLayer.length, 0);
    browser.location.pathname = "/catalogo";
    storage.setItem(analyticsPreference, "denied");
    sendExternalAnalyticsEvent("add_to_cart", { value: 1000 });
    assert.equal(browser.dataLayer.length, 0);
  });
});

test("GTM recibe un único evento y no se duplica mediante gtag", () => {
  withBrowser(({ browser, storage, calls }) => {
    storage.setItem(analyticsPreference, "granted");
    sendExternalAnalyticsEvent("add_to_cart", { value: 1000, currency: "COP" });
    assert.equal(browser.dataLayer.length, 1);
    assert.equal(calls.length, 0);
    assert.equal(browser.dataLayer[0].event, "add_to_cart");
    assert.equal(browser.dataLayer[0].value, 1000);
    assert.equal(browser.dataLayer[0].page_location, "https://cinemerch.example/catalogo");
    assert.equal(browser.dataLayer[0].page_referrer, "");
    assert.equal(JSON.stringify(browser.dataLayer).includes("privado@example.test"), false);
  });
});

test("las compras mantienen sus importes y excluyen los cupones individuales", () => {
  withBrowser(({ browser, storage }) => {
    storage.setItem(analyticsPreference, "granted");
    trackPurchase({ transaction_id: "prueba", value: 1000, shipping: 0, tax: 160,
      coupon: "CINEMERCH10-PRIVADO", payment_type: "WOMPI_NEQUI", items: [],
    });
    assert.equal(browser.dataLayer.length, 1);
    assert.equal(browser.dataLayer[0].event, "purchase");
    assert.equal(browser.dataLayer[0].currency, "COP");
    assert.equal(browser.dataLayer[0].value, 1000);
    assert.equal(browser.dataLayer[0].coupon, undefined);
  });
});
