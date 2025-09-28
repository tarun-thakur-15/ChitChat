"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Conversation, UserMini } from "@/app/services/schema";
import { useChatStore } from "@/app/stores/chatStore";
import Image from "next/image";

interface ChatListProps {
  searchQuery: string;
  conversations: Conversation[];
  friendsWithoutConversation: UserMini[];
  currentUserId?: string;
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
}: ChatListProps) {
  const setActiveChat = useChatStore((state) => state.setActiveChat);

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
        type: "conversation" as const, // ✅ Type cast here
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
        unreadCount: (conv as any).unreadCount ?? 0,
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
            {chat.user.avatar ? (
              <>
                <Image
                  src={chat.user.avatar}
                  alt="sd"
                  height={48}
                  width={48}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {typeof chat.user.avatar === "string" &&
                    chat.user.avatar.length <= 3
                      ? chat.user.avatar
                      : chat.user.avatar?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </>
            )}

            {chat.user.online && (
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

      {filteredChats.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No chats found
        </div>
      )}
    </div>
  );
}
