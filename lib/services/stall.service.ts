import { apiClient } from "@/lib/utils/api-client";

export class StallService {
  /**
   * Get stall details
   */
  static async getStallById(stallId: string, accessToken?: string) {
    try {
      const data = await apiClient.get(`/stalls/${stallId}`, { accessToken });
      return data;
    } catch (error) {
      console.error("Error fetching stall:", error);
      throw error;
    }
  }

  /**
   * Get stall products
   */
  static async getStallProducts(stallId: string, accessToken?: string) {
    try {
      const data = await apiClient.get(`/stalls/${stallId}/products`, {
        accessToken,
      });
      return data;
    } catch (error) {
      console.error("Error fetching stall products:", error);
      throw error;
    }
  }
}
