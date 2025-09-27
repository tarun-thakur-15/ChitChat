"use client"
import { motion } from "framer-motion";

//schema
import { UserProfile as UserProfileSchema } from "@/app/services/schema";
type UserProfileAboutPreview = Pick<
  UserProfileSchema,
  "bio" 
>;


export default function UserProfileAbout ({bio}: UserProfileAboutPreview) {
    return(
        <>
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
             
              <span>{bio}</span>
            </div>

          </div>
        </motion.div>
        </>
    )
}