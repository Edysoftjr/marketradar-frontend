import { UserProfile, DashboardData, Role, AccountStatus } from "@/types";
import { fetchWithTokenRefresh, getValidAccessToken } from "./token-refresh";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  accessToken: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get authenticated user (from headers or cookies)
 */
export async function getAuthenticatedUser(
  request?: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // Try Authorization header first
    const authToken = request?.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    if (authToken) {
      const profile = await getUserProfile(authToken);
      if (profile) {
        return {
          userId: profile.id,
          email: profile.email,
          role: profile.role,
          accessToken: authToken,
        };
      }
    }

    // Fall back to cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("accessToken")?.value;
    if (!cookieToken) return null;

    const validToken = await getValidAccessToken();
    if (!validToken) return null;

    const profile = await getUserProfile(validToken);
    if (!profile) return null;

    return {
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      accessToken: validToken,
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Get user profile (no caching)
 */
export async function getUserProfile(
  accessToken?: string
): Promise<UserProfile | null> {
  try {
    const token = accessToken || (await getValidAccessToken());
    if (!token) return null;

    console.log(`[FETCH] Getting user profile from API`);

    const response = await fetchWithTokenRefresh(
      `${API_BASE_URL}/auth/profile`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        accessToken: token,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.profile ?? null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Get dashboard data (no caching)
 */
export async function getDashboardData(
  accessToken?: string
): Promise<DashboardData> {
  const defaultDashboardData: DashboardData = {
    user: {
      id: "",
      name: "",
      email: "",
      role: Role.USER,
      emailVerified: false,
      accountStatus: AccountStatus.ACTIVE,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    stats: {
      orders: 0,
      favorites: 0,
      rating: 0,
      reviews: 0,
      stallSubscribers: 0,
      vendorSubscribers: 0,
    },
    recentOrders: [],
    vendorRecentOrders: [],
    userStalls: [],
  };

  try {
    const token = accessToken || (await getValidAccessToken());
    if (!token) return defaultDashboardData;

    console.log(`[FETCH] Getting dashboard data from API`);

    const response = await fetchWithTokenRefresh(`${API_BASE_URL}/dashboard`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      accessToken: token,
    });

    if (response.ok) {
      const { data } = await response.json();
      return data ?? defaultDashboardData;
    }

    return defaultDashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return defaultDashboardData;
  }
}

export async function getAccessToken(): Promise<string | null> {
  return await getValidAccessToken();
}
