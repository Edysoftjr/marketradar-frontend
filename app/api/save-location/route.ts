import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { lat, lng } = await req.json();

  const cookieStore = await cookies();

  cookieStore.set("userLat", String(lat), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  cookieStore.set("userLng", String(lng), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}
