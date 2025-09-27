import SearchUsersClient from "@/components/SearchUsersClient";
import { getSuggestedUsersApi } from "../services/serverapi";
import { cookies } from "next/headers";
import { SuggestedUser } from "../services/schema";

export default async function SearchUsersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  let suggestedUsers: SuggestedUser[] = [];
  try {
    const data = await getSuggestedUsersApi();
    suggestedUsers = Array.isArray(data.suggested)
      ? data.suggested
      : [data.suggested];
  } catch (err) {
    console.error("Error fetching suggested users:", err);
  }

  return <SearchUsersClient initialUsers={suggestedUsers} token={token} />;
}
