export function siteOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export const publicPages = ["/", "/catalogo", "/kits", "/preventas", "/fidelizacion", "/privacidad", "/condiciones"];
