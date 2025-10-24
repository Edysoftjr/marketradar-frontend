const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const getUserFavorites = async (): Promise<string[]> => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};
