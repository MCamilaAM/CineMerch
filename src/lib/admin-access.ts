export const adminTokenKey = "cinemerch_admin_token";
export const adminTokenChangedEvent = "cinemerch:admin-token-changed";

export async function verifyAdminAccess(token: string, signal?: AbortSignal) {
  if (!token) return false;
  const response = await fetch("/api/admin/access", {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
    signal,
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.success === true;
}
