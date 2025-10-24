const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function updateUserLocation({
  latitude,
  longitude,
  addressState,
  addressCity,
  addressLandmark,
  addressRaw,
  accessToken,
}: {
  latitude: number;
  longitude: number;
  addressState?: string;
  addressCity?: string;
  addressLandmark?: string;
  addressRaw?: string;
  accessToken: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const res = await fetch(`${API_BASE_URL}/location`, {
    method: "PATCH",
    headers,
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({
      latitude,
      longitude,
      addressState,
      addressCity,
      addressLandmark,
      addressRaw,
    }),
  });
  if (!res.ok) throw new Error("Failed to update user location");
  return await res.json();
}
