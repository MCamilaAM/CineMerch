const configuredContainer = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-T6QZZ4X9";
const configuredMeasurement = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const GTM_CONTAINER_ID = /^GTM-[A-Z0-9]+$/.test(configuredContainer) ? configuredContainer : "";
export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/.test(configuredMeasurement) && configuredMeasurement !== "G-CINEMERCH2026"
  ? configuredMeasurement : "";
export const externalAnalyticsConfigured = Boolean(GTM_CONTAINER_ID || GA_MEASUREMENT_ID);

// Initialize the Google snippet in head without sending data before consent.
export const googleTagBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
`;

export function loadGoogleTag() {
  if (!externalAnalyticsConfigured || document.getElementById("cinemerch-google-tag")) return;
  const script = document.createElement("script");
  script.id = "cinemerch-google-tag";
  script.async = true;
  script.src = GTM_CONTAINER_ID
    ? "https://www.googletagmanager.com/gtm.js?id=" + GTM_CONTAINER_ID
    : "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(script);
}
