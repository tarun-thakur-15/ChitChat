"use client"
import { FriendRequestCard } from "@/components/FriendRequestCard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function FriendRequest () {
  const sampleUser = {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
    mutualFriends: 12,
    time: "30 minutes ago",
  };

  const handleAccept = (userId: string) => {
    console.log("Accepted friend request from:", userId);
  };

  const handleReject = (userId: string) => {
    console.log("Rejected friend request from:", userId);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Pending Friend Requests</h2>
            <p className="text-muted-foreground">
              You have new friend requests waiting for your response
            </p>
          </div>

          {/* Friend Request Cards Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            <FriendRequestCard
              user={sampleUser}
              onAccept={handleAccept}
              onReject={handleReject}
            />
            {/* You can add more friend request cards here */}
          </div>

          {/* Empty State for when no requests */}
          <div className="mt-12 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg">That's all for now!</p>
              <p className="text-sm mt-1">New friend requests will appear here</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};