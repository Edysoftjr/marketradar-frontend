import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getStallData } from "@/lib/server/stall";
import StallClient from "../stall-client";

export default async function StallPage({
  params,
}: {
  params?: Promise<{ stallId: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const stallId = resolvedParams?.stallId;

  if (!stallId) {
    console.error("Missing stallId in route params");
    redirect("/404");
  }

  // Securely read cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const latitude = cookieStore.get("userLat")?.value;
  const longitude = cookieStore.get("userLng")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  try {
    const stallData = await getStallData(stallId!, accessToken, latitude, longitude);

    const transformedComments = stallData.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      user: {
        name: comment.user.name,
        images: comment.user.images
      },
      rating: comment.rating ?? undefined,
      createdAt: comment.createdAt,
      isOwner: comment.isOwner,
    }));

    return (
      <StallClient
        {...stallData}
        userAddress={stallData.userAddress}
        userEmail={stallData.userEmail}
        comments={transformedComments}
        products={stallData.products.map((p) => ({
          ...p,
          createdAt: p.createdAt ?? "",
        }))}
        accessToken={accessToken || ""}
      />
    );
  } catch (error) {
    console.error("Failed to fetch stall data:", error);
    redirect("/login");
  }
}
