import type {
  HomepageData,
  SearchFilters,
  SearchResults,
} from "@/types/homepage";
import { apiClient } from "@/lib/utils/api-client";
import { apiCache } from "@/lib/api-cache";

export class HomepageService {
  /**
   * Get all homepage data with caching
   */
  static async getHomepageData(
    latitude?: number,
    longitude?: number,
    accessToken?: string
  ): Promise<HomepageData> {
    try {
      const cacheKey = `homepage-${latitude || "no-lat"}-${
        longitude || "no-lng"
      }`;

      const cached = apiCache.get<HomepageData>(cacheKey);
      if (cached) {
        return cached;
      }

      const params: Record<string, string | number> = {};
      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }

      const responseData = await apiClient.get<any>("/homepage", {
        params,
        accessToken,
      });

      // Handle different response structures
      const data = responseData.data || responseData;

      // Provide default values for required fields
      const homepageData: HomepageData = {
        featuredStalls: data.featuredStalls || [],
        trendingProducts: data.trendingProducts || [],
        stallsByCategory: data.stallsByCategory || [],
        nearbyStalls: data.nearbyStalls || undefined,
        ...data,
      };

      apiCache.set(cacheKey, homepageData, 5 * 60 * 1000);

      return homepageData;
    } catch (error) {
      console.error("Error fetching homepage data:", error);

      // Return fallback data instead of throwing
      if (process.env.NODE_ENV === "development") {
        console.warn("Using fallback data for development");
        return {
          distance: undefined,
          featuredStalls: [],
          userAddress: {},
          email: "",
          userLocation: undefined,
          trendingProducts: [],
          stallsByCategory: [],
          nearbyStalls: undefined,
        };
      }

      throw error;
    }
  }

  /**
   * Search stalls and products with caching
   */
  static async search(
    query: string,
    filters?: SearchFilters,
    accessToken?: string
  ): Promise<SearchResults> {
    try {
      const cacheKey = `search-${query}-${JSON.stringify(filters || {})}`;

      const cached = apiCache.get<SearchResults>(cacheKey);
      if (cached) {
        return cached;
      }

      const params: Record<string, string | number> = { query };

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params[key] = String(value);
          }
        });
      }

      const responseData = await apiClient.get<any>("/homepage/search", {
        params,
        accessToken,
      });

      const data = responseData.data || responseData;

      // Ensure we have the expected structure
      const results: SearchResults = {
        stalls: data.stalls || [],
        products: data.products || [],
        ...data,
      };

      apiCache.set(cacheKey, results, 2 * 60 * 1000);

      return results;
    } catch (error) {
      console.error("Error searching:", error);

      // Return empty results on error instead of throwing
      if (process.env.NODE_ENV === "development") {
        console.warn("Search failed, returning empty results");
        return {
          stalls: [],
          products: [],
        };
      }

      throw error;
    }
  }

  /**
   * Get nearby stalls with caching
   */
  static async getNearbyStalls(
    latitude: number,
    longitude: number,
    radius?: number,
    accessToken?: string
  ) {
    try {
      // Validate coordinates
      if (
        !latitude ||
        !longitude ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Invalid coordinates provided");
      }

      const cacheKey = `nearby-${latitude}-${longitude}-${radius || "default"}`;

      const cached = apiCache.get<any[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const params: Record<string, string | number> = {
        latitude,
        longitude,
      };

      if (radius && radius > 0) {
        params.radius = radius;
      }

      const responseData = await apiClient.get<any>("/homepage/nearby", {
        params,
        accessToken,
      });

      const data = responseData.data || responseData;
      const results = Array.isArray(data) ? data : [];

      apiCache.set(cacheKey, results, 10 * 60 * 1000);

      return results;
    } catch (error) {
      console.error("Error fetching nearby stalls:", error);

      // Return empty array on error instead of throwing
      if (process.env.NODE_ENV === "development") {
        console.warn("Nearby stalls fetch failed, returning empty array");
        return [];
      }

      throw error;
    }
  }

  /**
   * Health check for the API
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get("/health");
      return true;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }

  /**
   * Invalidate all homepage caches
   */
  static invalidateCache() {
    apiCache.invalidatePattern("homepage");
    apiCache.invalidatePattern("search");
    apiCache.invalidatePattern("nearby");
  }
}
