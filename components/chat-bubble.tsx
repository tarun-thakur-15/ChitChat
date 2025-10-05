"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Check,
  CheckCheck,
  Download,
  FileText,
  MoreVertical,
  Trash2,
  Undo,
} from "lucide-react";
import Cookies from "js-cookie";
import { ChatMessage } from "@/app/services/schema";
import ImagePreviewDrawer from "./ImagePreviewDrawer";
import { useEffect, useRef, useState } from "react";
import { unsendMessageApi } from "@/app/services/api";
import { toast } from "sonner";

//images
import FallbackImage from "../app/images/fallback-chat-image.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  onUnsend: (messageId: string) => void;
}

export function ChatBubble({ message, onUnsend }: ChatBubbleProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isUnsending, setIsUnsending] = useState(false);
  const handleImageClick = () => {
    setDrawerOpen(true);
  };
  const theme = Cookies.get("chatTheme");

  // function for unsend message
  const handleUnsendMessage = async (id: string) => {
    try {
      setIsUnsending(true);
      setTimeout(async () => {
        const res = await unsendMessageApi(id);
        if (res.success) {
          onUnsend(message.id);
        }
      }, 600);
    } catch (err: any) {
      console.error(err);
    }
  };

  //dropdowns functionality for mobile
  const [showMenu, setShowMenu] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    // start a timer on touch start (for long-press)
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
    }, 600); // 600ms press duration
  };

  const handleTouchEnd = () => {
    // if touch ended before 600ms → cancel long press
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const closeMenu = () => setShowMenu(false);

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
                {message.fileSize
                  ? `${(Number(message.fileSize) / 1024).toFixed(1)} KB`
                  : ""}
              </p>
            </div>
            {/* <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button> */}
            <a
              href={message.content || ""}
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

  const formatMessageTime = (timestamp: Date | string) => {
    const msgDate = new Date(timestamp);
    const now = new Date();

    const diffMs = now.getTime() - msgDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      if (hours === 0) {
        const minutes = Math.floor(diffMs / (1000 * 60));
        return minutes <= 1
          ? "just now"
          : `about ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      }
      return `about ${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    // Older than a day → hh:mm am/pm
    let hours = msgDate.getHours();
    const minutes = msgDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // convert 0 to 12
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={` flex ${
          message.isOwn ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md ${
            message.isOwn ? "order-2" : "order-1"
          }`}
        >
          <motion.div
            animate={
              isUnsending
                ? {
                    scale: [1, 1.2, 0],
                    rotate: [0, 10, -10, 0],
                    opacity: [1, 0.8, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(5px)"],
                  }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`relative group px-4 py-2 rounded-2xl shadow-sm transition-colors ${
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
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white dark:bg-gray-700 rounded-bl-sm border border-gray-200 dark:border-gray-600"
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => {
              e.preventDefault(); // Prevent native context menu
              setShowMenu(true); // For right-click (desktop)
            }}
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

            {/* Message content */}
            {renderContent()}

            {/* 3-dot icon for desktop hover */}
            {message.isOwn && (

            
            <div
              className={`absolute top-[6px] -left-6
               opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => setShowMenu((p) => !p)}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-40"
                  onClick={closeMenu}
                >
                  {message.isOwn ? (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleUnsendMessage(message.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Undo className="w-4 h-4" /> Unsend
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        // onClick={() => handleDeleteMessage(message._id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete for me
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      // onClick={() => handleDeleteMessage(message._id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete for me
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            )}
          </motion.div>

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
              {/* {formatDistanceToNow(message.timestamp, { addSuffix: true })} */}
              {formatMessageTime(message.timestamp)}
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
