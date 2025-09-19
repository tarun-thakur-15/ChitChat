import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

interface FriendRequestCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    mutualFriends?: number;
    time?: string;
  };
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
}

export const FriendRequestCard = ({
  user,
  onAccept,
  onReject,
}: FriendRequestCardProps) => {

  const handleAccept = () => {
    onAccept?.(user.id);
    toast.success(`Friend request accepted! You and ${user.name} are now friends.`);
  };

  const handleReject = () => {
    onReject?.(user.id);
    toast.error(`Friend request declined. ${user.name}'s friend request has been declined.`);
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* User Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5">
              <UserPlus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg text-card-foreground">
              {user.name}
            </h3>
            {user.mutualFriends && user.mutualFriends > 0 && (
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{user.mutualFriends} mutual friends</span>
              </div>
            )}
            {user.time && (
              <p className="text-sm text-muted-foreground">{user.time}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 w-full">
            <Button
              onClick={handleAccept}
              variant="default"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              Accept
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
