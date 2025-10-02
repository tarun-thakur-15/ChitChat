"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CallModalProps {
  open: boolean;
  isIncoming: boolean;
  callerName?: string | null;
  status?: "calling" | "ringing" | "in-call" | "rejected" | "ended" | "connecting";
  onAccept?: () => void;
  onDecline: () => void;
}

export default function CallModal({
  open,
  isIncoming,
  callerName,
  status = "calling",
  onAccept,
  onDecline,
}: CallModalProps) {
  const statusTextMap: Record<string, string> = {
    calling: "Calling...",
    ringing: "Ringing...",
    connecting: "Connecting...", // ✅ added
    "in-call": "In Call...",     // ✅ clearer wording
    rejected: "Call Rejected",
    ended: "Call Ended",
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="sm:max-w-sm w-full rounded-2xl p-6 bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {isIncoming ? "Incoming Call" : "Calling"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-4 mt-2">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-300">
            {callerName ? callerName.charAt(0).toUpperCase() : "U"}
          </div>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {callerName || "Unknown User"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {statusTextMap[status] ||
              (isIncoming ? "Incoming Call..." : "Waiting...")}
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {isIncoming ? (
            <>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={onAccept}
              >
                Accept
              </Button>
              <Button variant="destructive" onClick={onDecline}>
                Decline
              </Button>
            </>
          ) : (
            <Button variant="destructive" onClick={onDecline}>
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
