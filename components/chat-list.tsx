"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Conversation, UserMini } from "@/app/services/schema";
import { useChatStore } from "@/app/stores/chatStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { checkUserOnline, socket } from "@/socket";
import { useEffect, useState } from "react";

interface ChatListProps {
  searchQuery: string;
  conversations: Conversation[];
  friendsWithoutConversation: UserMini[];
  currentUserId?: string;
  isChatListLoading: boolean;
}

interface ChatItem {
  id: string;
  type: "conversation" | "friend";
  conversationId?: string;
  friendId?: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    online: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isOwn: boolean;
  };
  unreadCount: number;
}

export function ChatList({
  searchQuery,
  conversations = [],
  friendsWithoutConversation = [],
  currentUserId,
  isChatListLoading,
}: ChatListProps) {
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  const participantId = conversations?.[0]?.participants?.find(
    (p) => p._id !== currentUserId
  )?._id;
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!participantId) return;

    

    checkUserOnline(participantId).then((status) => {
      setIsOnline(status);
      
    });

    socket.on("user:status", ({ userId: changedUserId, online }) => {
      if (changedUserId === participantId) {
        setIsOnline(online);
        
      }
    });

    return () => {
      socket.off("user:status");
    };
  }, [participantId]);

  const chats: ChatItem[] = [
    ...conversations.map((conv) => {
      const participants = conv.participants ?? [];
      const other =
        participants.length === 0
          ? {
              _id: "",
              username: "",
              fullName: "Unknown",
              profileImage: undefined,
            }
          : participants.length === 1
          ? participants[0]
          : participants.find((p) => p._id !== currentUserId) ??
            participants[0];

      const lm = (conv as any).latestMessage;
      const lastMessageContent =
        lm?.message ?? (lm?.mediaUrl ? "Attachment" : "No messages yet");

      const lastMessageTimestamp = lm?.createdAt
        ? new Date(lm.createdAt)
        : conv.updatedAt
        ? new Date(conv.updatedAt)
        : new Date();

      const isOwn =
        !!lm && !!lm.sender && String(lm.sender._id) === String(currentUserId);

      const avatar =
        other.profileImage ??
        (other.fullName || other.username || "")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();

      return {
        id: conv._id,
        type: "conversation" as const,
        conversationId: conv._id,
        user: {
          name: other.fullName || other.username || "Unknown",
          avatar,
          username: other.username || "",
          online: false,
        },
        lastMessage: {
          content: lastMessageContent,
          timestamp: lastMessageTimestamp,
          isOwn,
        },
        // use newMessagesCount from backend participant object
        unreadCount: (other as any).newMessagesCount ?? 0,
      };
    }),

    ...friendsWithoutConversation.map((friend) => {
      const avatar =
        friend.profileImage ??
        (friend.fullName || friend.username || "")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

      return {
        id: friend._id,
        type: "friend" as const, // ✅ Type cast here
        friendId: friend._id,
        user: {
          name: friend.fullName || friend.username || "Unknown",
          avatar,
          username: friend.username || "",
          online: false,
        },
        lastMessage: {
          content: "Say hello 👋",
          timestamp: new Date(),
          isOwn: false,
        },
        unreadCount: 0,
      };
    }),
  ];

  const filteredChats = chats.filter((chat) =>
    `${chat.user.name} ${chat.user.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 space-y-2">
      {filteredChats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          onClick={() => {
            if (chat.type === "conversation" && chat.conversationId) {
              setActiveChat("conversation", chat.conversationId);
            }
            if (chat.type === "friend" && chat.friendId) {
              setActiveChat("friend", chat.friendId);
            }
          }}
        >
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={chat.user.avatar}
                height={48}
                width={48}
                alt={chat.user.avatar}
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback>
                {chat.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>

          {/* Chat Content */}
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {chat.user.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(chat.lastMessage.timestamp, {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {chat.lastMessage.isOwn && "✓ "}
                {chat.lastMessage.content}
              </p>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ml-2">
                  <span className="text-xs text-white font-medium">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      {isChatListLoading ? (
        <div
          role="status"
          className="max-w-sm p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
        >
          <div className="flex items-center">
            <svg
              className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
              <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        filteredChats.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No chats found
          </div>
        )
      )}
    </div>
  );
}
