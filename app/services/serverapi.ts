import { cookies } from "next/headers";
import {
  GetSuggestedUsersResponse,
  MyProfileResponse,
  GetFriendRequestsResponse,
  UserProfile,
  
} from "./schema";
const backend_url = "https://chat-shat-backend.onrender.com/api";
import { notFound } from "next/navigation";

export const fetchMyProfileSSR = async (): Promise<MyProfileResponse> => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${backend_url}/myprofile`, {
    headers: {
      Cookie: token ? `accessToken=${token}` : "",
    },
    cache: "no-store", // important for fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};

export async function getSuggestedUsersApi(): Promise<GetSuggestedUsersResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${backend_url}/getSuggestedUsers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: token ? `accessToken=${token}` : "",
    },
    cache: "no-store",
  });

  

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response body:", errorText);
    throw new Error("Failed to fetch suggested users");
  }

  return res.json();
}

export async function getFriendRequestsApi(): Promise<GetFriendRequestsResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch(`${backend_url}/friends/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: `accessToken=${token}`,
    },
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    throw new Error("Failed to fetch friend requests");
  }

  return res.json();
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${backend_url}/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${token}`, // send cookie directly
      },
    });

    // If fetch itself fails
    if (!res.ok) {
      console.error("Failed to fetch user profile:", await res.text());
      notFound(); // redirect to 404
    }

    const data = await res.json();

    // If API responds with success: false
    if (!data.success) {
      console.error("User not found:", data.message);
      notFound(); // redirect to 404
    }

    return data.profile;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    notFound(); // redirect to 404 on any error
  }
}

