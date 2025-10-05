"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { startProgress } from "@/app/utils/progress";

interface Friend {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  joinedOn: string;
  friendsCount: number;
}

interface FriendsListProps {
  searchQuery: string;
  friends: Friend[];
  loading: boolean;
}

export function FriendsList({
  searchQuery,
  friends,
  loading,
}: FriendsListProps) {
  if (loading) {
    return <div className="p-4 text-center">Loading friends...</div>;
  }

  if (friends.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No friends found</div>
    );
  }

  return (
    <div className="px-4 space-y-2">
      {friends.map((friend, index) => (
        <Link href={`/user/${friend.username}`} onClick={()=> startProgress()} key={friend._id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={friend.profileImage}
                  height={48}
                  width={48}
                  alt={friend.profileImage}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>
                  {friend.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 ml-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {friend.fullName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{friend.username} •{" "}
                {friend.friendsCount ? friend.friendsCount : 0} friends
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
