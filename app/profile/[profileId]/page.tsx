import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTargetProfileData } from "@/lib/server/profile";
import ProfileClient from "../profile-client";
import type { ProfileResponse } from "@/types/profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<any> | undefined;
}) {
  const resolvedParams = await Promise.resolve(params);
  const { profileId } = resolvedParams as { profileId: string };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  const response: ProfileResponse = await getTargetProfileData(
    profileId,
    accessToken!
  );

  if (!response.success || !response.data) {
    redirect("/login");
  }

  return (
    <ProfileClient
      initialData={response.data}
      userAddress={response.data?.user.address}
      accessToken={accessToken!}
    />
  );
}
