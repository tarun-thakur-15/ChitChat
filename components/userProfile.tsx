"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import DefaultCoverImage from "../app/images/defaultCoverPicture.png";
import { sendFriendRequestApi, acceptFriendRequestApi } from "@/app/services/api";
import { UserProfile as UserProfileSchema } from "@/app/services/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { checkUserOnline, socket } from "@/socket";
import { toast } from "sonner";

type UserProfilePreview = Pick<
  UserProfileSchema,
  | "fullName"
  | "username"
  | "coverImage"
  | "profileImage"
  | "isFriend"
  | "_id"
  | "hasSendFriendRequest"
  | "hasReceivedFriendRequest"
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
  hasReceivedFriendRequest,
  loggedinUserId,
}: UserProfilePreview) {
  const [isFriendState, setIsFriendState] = useState(isFriend);
  const [hasReceivedRequestState, setHasReceivedRequestState] = useState(hasReceivedFriendRequest);
  const [hasSendRequestState, setHasSendRequestState] = useState(hasSendFriendRequest);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // ✅ Handle sending friend request
  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const res = await sendFriendRequestApi(_id);
      if (res.success) {
        toast.success("Friend request sent!");
        setHasSendRequestState(true);
      } else {
        toast.error(res.message || "Unable to send friend request");
      }
    } catch (error) {
      console.error("❌ Error sending friend request:", error);
      toast.error("Error sending friend request");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle accepting friend request
  const handleAcceptRequest = async () => {
    try {
      setLoading(true);
      const res = await acceptFriendRequestApi(_id);
      if (res.success) {
        toast.success("Friend request accepted!");
        // ✅ Immediately update local state
        setIsFriendState(true);
        setHasReceivedRequestState(false);
      } else {
        toast.error(res.message || "Can't accept friend request now");
      }
    } catch (error) {
      console.error("❌ Error accepting friend request:", error);
      toast.error("Error accepting friend request");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle rejecting friend request
  const handleRejectRequest = async () => {
    try {
      setLoading(true);
      // If you have reject API call:
      // const res = await rejectFriendRequestApi(_id);
      // if (res.success) toast.success("Friend request rejected!");
      // For now, fake success:
      toast.success("Friend request rejected!");
      setHasReceivedRequestState(false);
      setHasSendRequestState(false);
      setIsFriendState(false);
    } catch (error) {
      toast.error("Error rejecting friend request");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Online status tracking
useEffect(() => {
  if (!_id) return;

  // Initial online check
  checkUserOnline(_id).then((status) => setIsOnline(status));

  // Define handler
  const handleUserStatus = ({ userId: changedUserId, online }: { userId: string; online: boolean }) => {
    if (changedUserId === _id) {
      setIsOnline(online);
    }
  };

  // Subscribe to socket updates
  socket.on("user:status", handleUserStatus);

  // Clean up only this listener
  return () => {
    socket.off("user:status", handleUserStatus);
  };
}, [_id]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
    >
      {/* Cover Image */}
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
            <div className="w-32 h-32 relative">
              <Avatar className="w-full h-full rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={profileImage} alt={fullName} />
                <AvatarFallback className="text-5xl">
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-2 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 mt-4 md:mt-[63px]">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {fullName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-1">@{username}</p>

            {/* Action Buttons */}
            {loggedinUserId !== _id && (
              <>
                {isFriendState ? (
                  // ✅ Already friends → show Chat
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </motion.button>
                ) : hasReceivedRequestState ? (
                  // ✅ You received a request → show Accept / Reject
                  <div className="flex justify-between gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAcceptRequest}
                      disabled={loading}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRejectRequest}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </motion.button>
                  </div>
                ) : hasSendRequestState ? (
                  // ✅ You sent a request → show Requested
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled
                    className="flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-colors bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Requested</span>
                  </motion.button>
                ) : (
                  // ✅ No relation → show Send Request
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendRequest}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-colors ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{loading ? "Sending..." : "Send Request"}</span>
                  </motion.button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
