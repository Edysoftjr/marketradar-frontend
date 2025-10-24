import { StallWithDetails, StallFullData, StallFilters } from "@/types";
import { fetchWithTokenRefresh } from "./token-refresh";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get detailed stall data
 */
export async function getStallData(
  stallId: string,
  accessToken?: string,
  latitude?: string,
  longitude?: string
): Promise<StallFullData> {
  const url = new URL(`${API_BASE_URL}/stalls/${stallId}`);

  if (latitude && longitude) {
    url.searchParams.append("latitude", latitude.toString());
    url.searchParams.append("longitude", longitude.toString());
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    console.log(
      "Stall data fetch failed:",
      response.status,
      response.statusText
    );
    throw new Error("Failed to fetch stall data");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get all stalls with filters
 */
export async function getAllStalls(
  accessToken?: string,
  filters?: StallFilters
): Promise<StallWithDetails[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.area) params.append("area", filters.area);
  if (filters?.city) params.append("city", filters.city);
  if (filters?.state) params.append("state", filters.state);

  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/stalls?${params.toString()}`,
    {
      cache: "no-store",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stalls");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get user's own stalls
 */
export async function getUserStalls(
  accessToken?: string
): Promise<StallWithDetails[]> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/stalls/user/stalls`,
    {
      cache: "no-store",
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user stalls");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update stall
 */
export async function updateStall(
  stallId: string,
  data: FormData,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE_URL}/stalls/${stallId}`, {
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

/**
 * Create new stall
 */
export async function createStall(
  data: FormData,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/stalls`, {
    method: "POST",
    body: data,
    accessToken,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create stall");
  }

  const result = await response.json();
  return result;
}

/**
 * Delete stall
 */
export async function deleteStall(
  stallId: string,
  accessToken?: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/stalls/${stallId}`,
    {
      method: "DELETE",
      accessToken,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete stall");
  }

  const result = await response.json();
  return result;
}

/**
 * Add comment/rating to stall
 */
export async function addComment(
  stallId: string,
  content: string,
  accessToken?: string,
  rating?: number
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/stalls/${stallId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, rating }),
      accessToken: accessToken,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add comment");
  }

  const result = await response.json();
  return result;
}
