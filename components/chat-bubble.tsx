"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, CheckCheck, Download, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import { ChatMessage } from "@/app/services/schema";
import ImagePreviewDrawer from "./ImagePreviewDrawer";
import { useState } from "react";

//images
import FallbackImage from "../app/images/fallback-chat-image.png";

export interface Message {
  fileSize: string;
  id: string;
  content: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  fileName?: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleImageClick = () => {
    setDrawerOpen(true);
  };
  const theme = Cookies.get("chatTheme");
  const StatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div
            onClick={handleImageClick}
            className="relative w-48 h-48 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image
              src={message.content || FallbackImage}
              alt={message.fileName || "Shared image"}
              height={192}
              width={192}
              className="object-cover w-full h-full"
            />
          </div>
        );

      case "file":
        return (
          <div
            className={`flex items-center space-x-3 p-3 
          ${
            theme === "Superman"
              ? message.isOwn
                ? "bg-yellow-400 text-gray-900 rounded-br-sm"
                : "bg-blue-400 text-white rounded-bl-sm"
              : theme === "Hearts" && message.isOwn
              ? "bg-purple-900"
              : theme === "Hearts" && !message.isOwn
              ? "bg-[#1b5105]"
              : theme === "Couple" && message.isOwn
              ? "bg-[#063394]"
              : theme === "Couple" && !message.isOwn
              ? "bg-green-800"
              : message.isOwn
              ? "bg-blue-600 border-blue-200 text-white rounded-br-sm"
              : "bg-white dark:bg-gray-600 rounded-bl-sm border border-gray-200"
          }
           rounded-xl min-w-[200px]`}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {message.fileName || "Document"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {message.fileSize ? `${(Number(message.fileSize) / 1024).toFixed(1)} KB` : ""}
              </p>
            </div>
            {/* <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button> */}
            <a
              ref={message.content}
              download
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        );

      default:
        return (
          <p
            className={`text-gray-900 ${
              theme === "Superman"
                ? message.isOwn
                  ? "text-black"
                  : "text-gray-900 dark:text-white"
                : theme === "Hearts"
                ? "text-white"
                : message.isOwn
                ? " text-white"
                : "text-gray-900 dark:text-white"
            }  whitespace-pre-wrap break-words`}
          >
            {message.content}
          </p>
        );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex ${
          message.isOwn ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md ${
            message.isOwn ? "order-2" : "order-1"
          }`}
        >
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm ${
              theme === "Superman"
                ? message.isOwn
                  ? "bg-yellow-400 text-gray-900 rounded-br-sm" // our msg → yellow
                  : "bg-blue-400 text-white rounded-bl-sm" // others msg → blue
                : theme === "Hearts" && message.isOwn
                ? "bg-purple-900"
                : theme === "Hearts" && !message.isOwn
                ? "bg-[#1b5105]"
                : theme === "Couple" && message.isOwn
                ? "bg-[#063394]"
                : theme === "Couple" && !message.isOwn
                ? "bg-green-800"
                : message.isOwn
                ? "bg-blue-600 text-white rounded-br-sm" // default our msg
                : "bg-white dark:bg-gray-700 rounded-bl-sm border border-gray-200 dark:border-gray-600" // default others
            }`}
          >
            {/* Emoji overlay for Couple theme */}
            {theme === "Couple" && (
              <>
                <span className="absolute -top-2 -left-2 text-2xl">💕</span>
                <span className="absolute -top-2 -right-2 text-2xl">💕</span>
                <span className="absolute -bottom-2 -right-2 text-2xl">💕</span>
                <span className="absolute -bottom-2 -left-2 text-2xl">💕</span>
              </>
            )}
            {renderContent()}
          </div>

          <div
            className={`flex items-center space-x-1 mt-1 px-2 ${
              message.isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-xs ${
                theme === "Hearts" || "Superman"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {message.isOwn && <StatusIcon />}
          </div>
        </div>
      </motion.div>
      <ImagePreviewDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        imageUrl={message.content || ""}
        fileName={message.fileName}
      />
    </>
  );
}
