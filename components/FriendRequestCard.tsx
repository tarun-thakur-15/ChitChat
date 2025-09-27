"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { FriendRequest } from "@/app/services/schema";
import { acceptFriendRequestApi, deleteFriendRequestApi } from "@/app/services/api";

interface Props {
  request: FriendRequest;
  onRemove: (userId: string) => void; // callback to remove request from UI
}

export const FriendRequestCard = ({ request, onRemove }: Props) => {
  const [accepted, setAccepted] = useState(false);
  const initials = request.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleAccept = async () => {
    try {
      await acceptFriendRequestApi(request._id);
      setAccepted(true);
      toast.success(`Friend request accepted! You and ${request.fullName} are now friends.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept friend request");
    }
  };

  const handleReject = async () => {
    try {
      await deleteFriendRequestApi(request._id);
      onRemove(request._id); // remove from UI
      toast.success(`Friend request from ${request.fullName} declined.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline friend request");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src={request.profileImage} alt={request.fullName} />
              <AvatarFallback className="bg-muted text-muted-foreground text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
              <UserPlus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg text-card-foreground">{request.fullName}</h3>
            <p className="text-sm text-muted-foreground">@{request.username}</p>
          </div>

          <div className="flex space-x-3 w-full">
            <Button
              onClick={handleAccept}
              variant="default"
              className={`flex-1 ${accepted ? "bg-green-600 hover:bg-green-800 text-white cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
              size="sm"
              disabled={accepted}
            >
              {accepted ? "Request Accepted" : "Accept"}
            </Button>
            {!accepted && (
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Decline
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
