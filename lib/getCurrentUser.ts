// lib/getCurrentUser.ts
import { cookies } from "next/headers";
const backend_url = "https://chat-shat-backend.onrender.com/api";

export async function getCurrentUser() {
  const token = cookies().get("accessToken")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${backend_url}/getMe`, {
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
