"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { startProgress } from "@/app/utils/progress";

//api
import {
  acceptFriendRequestApi,
  deleteFriendRequestApi,
} from "@/app/services/api";
import { useEffect, useState } from "react";

interface FriendRequest {
  _id: string;
  fullName: string;
  username: string;
  profileImage?: string;
  createdAt: string;
}

interface FriendRequestsProps {
  requests: FriendRequest[];
  loading: boolean;
}

export function FriendRequests({ requests, loading }: FriendRequestsProps) {
  const router = useRouter();
  const [localRequests, setLocalRequests] = useState<FriendRequest[]>(requests);
  useEffect(() => {
    setLocalRequests(requests); // update if parent props change
  }, [requests]);

  const handleAccept = async (request: FriendRequest) => {
    try {
      const res = await acceptFriendRequestApi(request._id);
      if (res.success) {
        toast.success(
          res.message || `You can now chat with ${request.username}`,
          {
            icon: "✅",
            duration: 4000,
          }
        );
        setLocalRequests((prev) => prev.filter((r) => r._id !== request._id)); // remove accepted request
      } else {
        toast.error(res.message || "Failed to accept request", { icon: "❌" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error accepting request", { icon: "❌" });
    }
  };

  const handleDecline = async (request: FriendRequest) => {
    try {
      const res = await deleteFriendRequestApi(request._id);
      if (res.success) {
        toast.success(
          res.message || `Declined request from ${request.username}`,
          {
            icon: "✅",
            duration: 4000,
          }
        );
        setLocalRequests((prev) => prev.filter((r) => r._id !== request._id));
      } else {
        toast.error(res.message || "Failed to decline request", { icon: "❌" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error declining request", { icon: "❌" });
    }
  };

  if (loading) {
    return (
      <div className="px-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      {localRequests.map((request, index) => (
        <motion.div
          key={request._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => {
            router.push(`/user/${request.username}`), startProgress();
          }}
          className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={request.profileImage}
                  height={48}
                  width={48}
                  alt={request.profileImage}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>
                  {request.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {request.fullName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{request.username}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault(),
                e.stopPropagation(),
                handleAccept(request);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault(), e.stopPropagation(), handleDecline(request) ;
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </motion.button>
          </div>
        </motion.div>
      ))}

      <div className="w-full flex justify-end">
        <Link
          href={"/friend-requests"}
          target="_blank"
          className="text-blue-700 dark:text-white"
        >
          View all requests
        </Link>
      </div>

      {requests.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No friend requests
        </div>
      )}
    </div>
  );
}
