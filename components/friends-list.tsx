"use client";

import { motion } from "framer-motion";
import { MessageCircle, UserMinus } from "lucide-react";

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

export function FriendsList({ searchQuery, friends, loading }: FriendsListProps) {
  if (loading) {
    return <div className="p-4 text-center">Loading friends...</div>;
  }

  if (friends.length === 0) {
    return <div className="p-4 text-center text-gray-500">No friends found</div>;
  }

  return (
    <div className="px-4 space-y-2">
      {friends.map((friend, index) => (
        <motion.div
          key={friend._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {friend.fullName.charAt(0)}
              </span>
            </div>
          </div>

          <div className="flex-1 ml-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {friend.fullName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{friend.username} • {friend.friendsCount} friends
            </p>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <UserMinus className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
