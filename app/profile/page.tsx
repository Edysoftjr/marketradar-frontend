import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getProfileData } from "@/lib/server/profile";
import ProfileClient from "./profile-client";
import { ProfileResponse } from "@/types/profile";

export default async function ProfilePage() {
  // Get cookies for authentication
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Redirect to login if no token
  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  // Get user profile data
  const response: ProfileResponse = await getProfileData(accessToken!);

  if (!response.success || !response.data) {
    redirect("/login"); // or render error UI
  }

  return (
    <ProfileClient
      initialData={response.data}
      userAddress={response.data?.user.address}
      accessToken={accessToken!}
    />
  );
}
