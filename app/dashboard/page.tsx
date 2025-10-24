/* eslint-disable */
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardClient } from "./dashboard-client";
import { getDashboardData } from "@/lib/server/auth";
import { DashboardPageProps } from "@/types";

// Helper to check if JWT is expired
function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Helper to refresh access token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // No tokens at all - redirect to login
  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  // Try to refresh if access token is expired
  if (accessToken && isJwtExpired(accessToken) && refreshToken) {
    const newToken = await refreshAccessToken(refreshToken);
    if (newToken) {
      accessToken = newToken;
    } else {
      redirect("/login");
    }
  }

  // Final check - must have valid access token
  if (!accessToken) {
    redirect("/login");
  }

  try {
    // Fetch dashboard data (uses server-side cache)
    const dashboardData = await getDashboardData(accessToken);

    if (!dashboardData.user || !dashboardData.user.id) {
      redirect("/login");
    }

    // Render client component (uses client-side cache)
    return (
      <DashboardClient
        userProfile={dashboardData.user}
        dashboardData={dashboardData}
        accessToken={accessToken}
      />
    );
  } catch (error) {
    console.error("Dashboard page error:", error);
    redirect("/login");
  }
}