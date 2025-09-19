"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  UserPlus,
  Calendar,
  Users,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    setRequestSent(true);
  };

  const mockUser = {
    name: "Alice Johnson",
    username: "alice_j",
    avatar: "AJ",
    
    joinDate: new Date("2023-01-15"),
    friendsCount: 142,
    online: true,
    lastSeen: new Date(),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
     
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
        >
          {/* Cover Area */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                  <span className="text-white font-bold text-4xl">
                    {mockUser.avatar}
                  </span>
                </div>
                {mockUser.online && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 mt-4 md:mt-[55px]">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {mockUser.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  @{mockUser.username}
                </p>

               

                {/* Action Buttons */}
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
                      disabled={requestSent}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-colors ${
                        requestSent
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>
                        {requestSent ? "Request Sent" : "Send Request"}
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {mockUser.friendsCount}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Friends
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Status
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Jan 2023
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Joined
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
             
              <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, corporis mollitia maiores, sed, sequi asperiores accusantium illum nulla officia voluptas repellat voluptatem veritatis? Et corporis quis minus delectus laborum, consequuntur facere nihil id eaque quia minima vel non incidunt debitis labore vitae, aliquam odio eius ratione amet libero. Labore atque architecto natus aliquam harum voluptas veniam veritatis id vero perferendis commodi, nostrum laborum quisquam iure neque, deleniti odit error. Veritatis laborum quae numquam fugiat commodi, dignissimos illo temporibus cupiditate est amet totam, quidem asperiores, dolorum eveniet neque aliquam ratione delectus blanditiis aliquid. Tenetur praesentium maxime eum quam esse voluptatibus, suscipit deleniti, dolorum, quisquam labore fuga reprehenderit eos. Assumenda et nostrum voluptate nesciunt itaque adipisci mollitia dolorum facilis hic natus nam excepturi repellat qui sunt a accusantium doloribus vel quia consequatur, tempore accusamus enim officia sed. Distinctio hic exercitationem obcaecati dolor assumenda voluptatum fuga, quis quos recusandae modi cum qui quod.</span>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
