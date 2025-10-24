import { ProductWithStall } from "@/types/product";

interface FavoritesResponse {
  success: boolean;
  message?: string;
  data?: {
    favorites: ProductWithStall[];
    count: number;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function getUserFavorites(
  accessToken: string
): Promise<FavoritesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/favourites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      success: false,
      message: "Failed to fetch favorites",
    };
  }
}

export async function toggleFavorite(productId: string, accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/favourites/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle favorite");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return {
      success: false,
      message: "Failed to toggle favorite",
    };
  }
}
