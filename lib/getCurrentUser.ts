// lib/getCurrentUser.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const token = cookies().get("accessToken")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`http://localhost:10000/api/getMe`, {
      headers: {
        Cookie: `accessToken=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user; // { _id, fullName, username, profileImage }
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
