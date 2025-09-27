"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateBioApi } from "@/app/services/api";
import { MyProfileResponse } from "@/app/services/schema";

type MyProfilePreview = Pick<MyProfileResponse, "bio">;

export default function MyProfileAbout({ bio }: MyProfilePreview) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(bio || ""); // initial bio
  const [tempText, setTempText] = useState(aboutText);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = await updateBioApi(tempText);
      setAboutText(data.bio); // ✅ instantly update without reload
      setIsEditing(false);
      toast.success("Your bio has been updated!");
    } catch (err: any) {
      console.error("Update bio error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update bio");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempText(aboutText); // reset changes
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          About
        </h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-3 text-gray-600 dark:text-gray-400 break-words">
        {!isEditing ? (
          <p>
            {aboutText || (
              <span className="italic text-gray-400">
                You haven’t added an about yet. Tell others a bit about
                yourself!
              </span>
            )}
          </p>
        ) : (
          <div className="space-y-3">
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              disabled={loading}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
