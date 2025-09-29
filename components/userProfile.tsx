"use client";

import { motion } from "framer-motion";
import { MessageCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import DefaultCoverImage from "../app/images/defaultCoverPicture.png";
import DefaultProfileImage from "../app/images/business-man.png";
import { sendFriendRequestApi } from "@/app/services/api"; // ✅ Import API
import { UserProfile as UserProfileSchema } from "@/app/services/schema";

type UserProfilePreview = Pick<
  UserProfileSchema,
  | "fullName"
  | "username"
  | "coverImage"
  | "profileImage"
  | "isFriend"
  | "_id"
  | "hasSendFriendRequest"
> & {
  loggedinUserId: string;
};

export default function UserProfile({
  fullName,
  username,
  coverImage,
  profileImage,
  isFriend,
  _id,
  hasSendFriendRequest,
  loggedinUserId,
}: UserProfilePreview) {
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false); // disable button while request

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const res = await sendFriendRequestApi(_id);
      if (res.success) {
        setRequestSent(true);
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("❌ Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };
console.log("loggedinUserId:", loggedinUserId, "_id:", _id, "hasSendFriendRequest:", hasSendFriendRequest);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
    >
      {/* Cover Area */}
      <div className="relative rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
        <Image
          width={861}
          height={216}
          src={coverImage || DefaultCoverImage}
          alt="Cover"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
              <Image
                height={40}
                width={40}
                src={profileImage || DefaultProfileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 mt-4 md:mt-[55px]">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-1">@{username}</p>

            {/* Action Buttons */}
            {loggedinUserId !== _id &&
              (hasSendFriendRequest ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  <span>Requested</span>
                </motion.button>
              ) : (
                <div className="flex space-x-3">
                  {isFriend ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Start Chat</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendRequest}
                      disabled={requestSent || loading}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-colors ${
                        requestSent
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>
                        {loading
                          ? "Sending..."
                          : requestSent
                          ? "Requested"
                          : "Send Request"}
                      </span>
                    </motion.button>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
