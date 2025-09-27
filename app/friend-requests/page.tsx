import { getFriendRequestsApi } from "@/app/services/serverapi";
import { FriendRequest } from "@/app/services/schema";
import FriendRequestClient from "@/components/FriendRequestClient";

export default async function FriendRequestPage() {
  let requests: FriendRequest[] = [];

  try {
    const data = await getFriendRequestsApi();
    requests = data.requests;
  } catch (err) {
    console.error("Error fetching friend requests:", err);
  }

  return <FriendRequestClient initialRequests={requests} />;
}
