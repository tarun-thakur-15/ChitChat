"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchFriendsApi } from "@/app/services/api";
import { UserFriend } from "@/app/services/schema";
import Link from "next/link";
import { startProgress } from "@/app/utils/progress";

interface UserFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export default function UserFriendsModal({
  username,
  open,
  onOpenChange,
}: UserFriendsModalProps) {
  const [friends, setFriends] = useState<UserFriend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && friends.length === 0) {
      setLoading(true);
      searchFriendsApi(username)
        .then((data: any) => {
          setFriends(data.results);
        })
        .catch((err: any) => {
          console.error("❌ Error fetching friends:", err);
          setFriends([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, friends.length, username]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Friends List
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-60 pr-2">
          <div className="space-y-3">
            {loading ? (
              <div
                role="status"
                className="max-w-sm border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <svg
                    className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                  <div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : friends.length > 0 ? (
              friends.map((friend) => (
                <Link
                  href={`/user/${friend.username}`}
                  onClick={() => startProgress()}
                  key={friend._id}
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar>
                      <AvatarImage
                        height={40}
                        width={40}
                        src={friend.profileImage}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {friend.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {friend.fullName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        @{friend.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No friends found.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
