import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { NextApiRequest, NextApiResponse } from "next";
import { isJwtExpired } from "@/utils/jwt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type ContextLike =
  | GetServerSidePropsContext
  | { req: NextApiRequest; res: NextApiResponse };

// Helper function to get cookies that works in both client and server contexts
function getCookies(ctx?: ContextLike) {
  return nookies.get(ctx);
}

/**
 * Securely refresh access token using refresh token
 * Works in Pages Router, API routes, and SSR
 */
export async function tryRefreshAccessToken(
  ctx?: ContextLike
): Promise<string | null> {
  // Get refresh token from cookies
  const cookieData = getCookies(ctx);
  const refreshToken: string | undefined = cookieData?.refreshToken;

  console.log("[tryRefreshAccessToken] Cookies:", cookieData);
  console.log("[tryRefreshAccessToken] Refresh token:", refreshToken);

  if (!refreshToken) {
    console.log("[tryRefreshAccessToken] No refresh token, returning null");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    console.log("[tryRefreshAccessToken] Response status:", response.status);

    if (!response.ok) {
      console.log("[tryRefreshAccessToken] Refresh failed");
      return null;
    }

    const data: { accessToken?: string } = await response.json();
    console.log("[tryRefreshAccessToken] Response data:", data);

    if (data.accessToken) {
      // Save new access token in cookies
      nookies.set(ctx, "accessToken", data.accessToken, {
        path: "/",
        httpOnly: false, // because nookies can't set httpOnly from client-side
        sameSite: "lax",
      });

      console.log("[tryRefreshAccessToken] New access token set in cookies");
      return data.accessToken;
    }

    console.log("[tryRefreshAccessToken] No access token in response");
    return null;
  } catch (error) {
    console.error(
      "[tryRefreshAccessToken] Error refreshing access token:",
      error
    );
    return null;
  }
}

/**
 * Fetch wrapper that automatically refreshes access token on 401/403
 */
export async function fetchWithTokenRefresh(
  url: string,
  options: RequestInit & {
    accessToken?: string;
    ctx?: ContextLike;
    maxAttempts?: number;
  } = {},
  attempt = 1
): Promise<Response> {
  const {
    accessToken: optToken,
    ctx,
    maxAttempts = 10,
    ...fetchOptions
  } = options;

  if (attempt > maxAttempts) {
    throw new Error(`Max fetch attempts reached (${maxAttempts}) for ${url}`);
  }

  // Get access token from argument, cookies, or refresh
  let token: string | null = optToken || getCookies(ctx)?.accessToken || null;
  if (!token) token = await tryRefreshAccessToken(ctx);

  const headers: HeadersInit = new Headers(fetchOptions.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const doFetch = (h: HeadersInit) =>
    fetch(url, { ...fetchOptions, headers: h });
  const response = await doFetch(headers);

  // Retry on 401/403
  if ((response.status === 401 || response.status === 403) && !optToken) {
    console.log("[fetchWithTokenRefresh] Got 401/403, attempting refresh...");
    const newToken = await tryRefreshAccessToken(ctx);
    if (newToken) {
      console.log("[fetchWithTokenRefresh] Retrying with new token...");
      return fetchWithTokenRefresh(
        url,
        { ...options, accessToken: newToken, maxAttempts },
        attempt + 1
      );
    }
  }

  return response;
}

/**
 * Helper to get access token with automatic refresh
 */
export async function getAccessTokenWithRefresh(
  ctx?: ContextLike
): Promise<string | null> {
  const cookieData = getCookies(ctx);
  let accessToken: string | null = cookieData?.accessToken || null;

  if (!accessToken) {
    console.log("[getAccessTokenWithRefresh] No access token, trying refresh");
    accessToken = await tryRefreshAccessToken(ctx);
  }

  return accessToken;
}

/**
 * Get valid access token, refresh if expired
 */
export async function getValidAccessToken(
  ctx?: ContextLike
): Promise<string | null> {
  const cookieData = getCookies(ctx);
  let accessToken: string | null = cookieData?.accessToken || null;

  console.log("[getValidAccessToken] Initial cookies:", cookieData);
  console.log("[getValidAccessToken] Found accessToken:", accessToken);

  if (!accessToken) {
    console.log("[getValidAccessToken] No access token, trying refresh...");
    accessToken = await tryRefreshAccessToken(ctx);
    console.log("[getValidAccessToken] After refresh attempt:", accessToken);
    return accessToken;
  }

  // Check expiry
  const expired = isJwtExpired(accessToken);
  console.log("[getValidAccessToken] Token expired?", expired);

  if (expired) {
    const refreshToken = cookieData?.refreshToken || null;
    console.log(
      "[getValidAccessToken] Refresh token available?",
      !!refreshToken
    );

    if (refreshToken) {
      accessToken = await tryRefreshAccessToken(ctx);
      console.log(
        "[getValidAccessToken] After expired refresh attempt:",
        accessToken
      );
    } else {
      console.log("[getValidAccessToken] No refresh token, returning null");
      return null;
    }
  }

  console.log("[getValidAccessToken] Returning accessToken:", accessToken);
  return accessToken;
}
