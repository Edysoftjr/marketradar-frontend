// lib/server/profile.ts
import type { ProfileResponse, ProfileData } from "@/types/profile";
import { fetchWithTokenRefresh } from "./token-refresh";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type ApiRawResponse =
  | {
      success?: boolean;
      message?: string;
      data?: ProfileData;
    }
  | ProfileData;

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Get current user's profile data
 */
export async function getProfileData(
  accessToken?: string
): Promise<ProfileResponse> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/profile`, {
    accessToken,
  });

  const result = await safeJson<ApiRawResponse>(response);

  if (!result) {
    return { success: false, message: "Invalid JSON response from API" };
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        (result as { message?: string }).message ||
        "Failed to fetch profile data",
    };
  }

  if ("success" in result && typeof result.success === "boolean") {
    return result as ProfileResponse;
  }

  return { success: true, data: result as ProfileData };
}

/**
 * Get another user's profile data
 */
export async function getTargetProfileData(
  userId: string,
  accessToken?: string
): Promise<ProfileResponse> {
  const response = await fetchWithTokenRefresh(
    `${API_BASE_URL}/profile/${userId}`,
    {
      cache: "no-store",
      accessToken,
    }
  );

  const result = await safeJson<ApiRawResponse>(response);

  if (!result) {
    return { success: false, message: "Invalid JSON response from API" };
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        (result as { message?: string }).message ||
        "Failed to fetch target profile data",
    };
  }

  if ("success" in result && typeof result.success === "boolean") {
    return result as ProfileResponse;
  }

  return { success: true, data: result as ProfileData };
}

/**
 * Delete user account
 */
export async function deleteAccount(
  accessToken?: string
): Promise<ProfileResponse> {
  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/profile`, {
    method: "DELETE",
    accessToken,
  });

  const result = await safeJson<ApiRawResponse>(response);

  if (!result) {
    return { success: false, message: "Invalid JSON response from API" };
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        (result as { message?: string }).message || "Failed to delete account",
    };
  }

  if ("success" in result && typeof result.success === "boolean") {
    return result as ProfileResponse;
  }

  return { success: true, data: result as ProfileData };
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: {
    name?: string;
    bio?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    accountName?: string | null;
    phoneNumber?: string | null;
    mealPreferences?: string[];
    latitude?: number;
    longitude?: number;
  },
  file?: File,
  accessToken?: string
): Promise<ProfileResponse> {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.bio) formData.append("bio", data.bio);
  if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
  if (data.mealPreferences) {
    data.mealPreferences.forEach((pref, i) =>
      formData.append(`mealPreferences[${i}]`, pref)
    );
  }
  if (data.latitude !== undefined)
    formData.append("latitude", String(data.latitude));
  if (data.longitude !== undefined)
    formData.append("longitude", String(data.longitude));
  if (file) formData.append("images", file);
  if (data.bankName) formData.append("bankName", data.bankName);
  if (data.accountNumber) formData.append("accountNumber", data.accountNumber);
  if (data.accountName) formData.append("accountName", data.accountName);

  const response = await fetchWithTokenRefresh(`${API_BASE_URL}/profile/user`, {
    method: "PUT",
    body: formData,
    accessToken,
  });

  const result = await safeJson<ApiRawResponse>(response);

  if (!result) {
    return { success: false, message: "Invalid JSON response from API" };
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        (result as { message?: string }).message || "Failed to update profile",
    };
  }

  if ("success" in result && typeof result.success === "boolean") {
    return result as ProfileResponse;
  }

  return { success: true, data: result as ProfileData };
}
