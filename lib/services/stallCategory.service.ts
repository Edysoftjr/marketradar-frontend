const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function fetchStallCategories(accessToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch stall categories");
  const data = await res.json();
  return data.data || [];
}
