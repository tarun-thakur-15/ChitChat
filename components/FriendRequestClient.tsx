"use client";

import { useState } from "react";
import { FriendRequest } from "@/app/services/schema";
import { FriendRequestCard } from "@/components/FriendRequestCard";

interface Props {
  initialRequests: FriendRequest[];
}

export default function FriendRequestClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState<FriendRequest[]>(initialRequests);

  const handleRemove = (userId: string) => {
    setRequests((prev) => prev.filter((req) => req._id !== userId));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Pending Friend Requests
            </h2>
            <p className="text-muted-foreground">
              You have new friend requests waiting for your response
            </p>
          </div>

          {requests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {requests.map((req) => (
                <FriendRequestCard
                  key={req._id}
                  request={req}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg">That's all for now!</p>
                <p className="text-sm mt-1">
                  New friend requests will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
