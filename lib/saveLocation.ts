"use server";

import { cookies } from "next/headers";

export async function saveLocation(lat: number, lng: number) {
  const cookieStore = await cookies();
  cookieStore.set("userLat", lat.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  cookieStore.set("userLng", lng.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}
