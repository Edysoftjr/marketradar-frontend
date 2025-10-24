import { useState } from "react";
import { getUserFavorites } from "@/lib/favourites";

// import { useMutation } from "@tanstack/react-query";

// interface FavoriteResponse {
//   isFavorite: boolean;
//   productId: string;
// }

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// export const useFavorites = () => {
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   const toggleFavoriteMutation = useMutation({
//     mutationFn: async (productId: string): Promise<FavoriteResponse> => {
//       const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
//         method: "POST",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to toggle favorite");
//       }

//       const data: FavoriteResponse = await response.json();
//       return data;
//     },
//     onSuccess: (data: FavoriteResponse, productId: string) => {
//       setFavorites((prev) => {
//         if (data.isFavorite) {
//           return [...prev, productId];
//         } else {
//           return prev.filter((id) => id !== productId);
//         }
//       });
//     },
//   });

//   const fetchFavorites = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/favorites`, {
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch favorites");
//       }

//       const data = await response.json();
//       setFavorites(
//         data.favorites.map((fav: { productId: string }) => fav.productId)
//       );
//     } catch (error) {
//       console.error("Error fetching favorites:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     favorites,
//     loading,
//     fetchFavorites,
//     toggleFavorite: toggleFavoriteMutation.mutate,
//     isLoading: toggleFavoriteMutation.isPending,
//     isFavorite: (productId: string) => favorites.includes(productId),
//   };
// };

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const userFavorites = await getUserFavorites();
      setFavorites(userFavorites);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (productId: string, isFavorite: boolean) => {
    setFavorites((prev) =>
      isFavorite ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  return {
    favorites,
    loading,
    fetchFavorites,
    handleToggleFavorite,
    isFavorite: (productId: string) => favorites.includes(productId),
  };
};
