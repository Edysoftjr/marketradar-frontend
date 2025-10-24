import { fetchWithTokenRefresh } from "./token-refresh";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function updatePreference(
  data: FormData,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      message: errorData.message || "Failed to update stall",
    };
  }

  const result = await response.json();
  return {
    success: true,
    message: "Stall updated successfully",
    data: result,
  };
}
