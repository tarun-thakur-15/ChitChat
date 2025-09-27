"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Users, Clock } from "lucide-react";
import MyFriendsModal from "./myFriendsModal";
import { MyProfileResponse } from "@/app/services/schema";
type MyProfilePreview = Pick<MyProfileResponse, "joinedOn" | "totalFriends" | "username">;
export default function MyProfileCards({
  joinedOn,
  totalFriends,
  username
}: MyProfilePreview) {
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div
          onClick={() => setFriendsModalOpen(true)}
          role="button"
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {totalFriends}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Friends</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </motion.div>

      {/* ----------online status needs websocket so we will do this afterwards----------- */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              Online
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {joinedOn}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Joined</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </motion.div>

      <MyFriendsModal
        open={friendsModalOpen}
        onOpenChange={setFriendsModalOpen}
        username={username}
      />
    </>
  );
}
