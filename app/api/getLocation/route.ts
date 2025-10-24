import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const lat = cookieStore.get("userLat")?.value;
  const lng = cookieStore.get("userLng")?.value;

  if (!lat || !lng) {
    return Response.json(
      { message: "No location data found" },
      { status: 404 }
    );
  }

  return Response.json({
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
  });
}
