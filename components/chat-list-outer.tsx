"use client";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Plus,
  Settings,
  Bell,
  UserPlus,
  Users,
} from "lucide-react";
import { ChatList } from "@/components/chat-list";
import { FriendRequests } from "@/components/friend-requests-mini";
import { FriendsList } from "@/components/friends-list";
import { useState, useEffect } from "react";
import { Conversation, UserMini, GetConversationsResponse, UserFriend } from "@/app/services/schema";
import { getLastFriendRequestsApi, searchFriendsApi } from "@/app/services/api";
import { useUser } from "@/app/context/UserContext";

interface ChatListOuterProps {
  conversations: Conversation[];
  friendsWithoutConversation: UserMini[];
  totalFriendRequests: number;
}

export default function ChatListOuter({
  conversations,
  friendsWithoutConversation,
  totalFriendRequests
}: ChatListOuterProps) {
   const { user } = useUser();
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  type Tab = "chats" | "requests" | "friends";
  const tabs = [
    { id: "chats" as const, label: "Chats", icon: MessageSquare, count: 0 },
    { id: "requests" as const, label: "Requests", icon: UserPlus, count: totalFriendRequests },
    { id: "friends" as const, label: "Friends", icon: Users, count: 0 },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("chats");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  //for friend request api

  useEffect(() => {
    if (activeTab === "requests" && friendRequests.length === 0) {
      const fetchRequests = async () => {
        try {
          setLoadingRequests(true);
          const res = await getLastFriendRequestsApi();
          if (res.success) {
            setFriendRequests(res.requests);
          }
        } catch (err) {
          console.error("❌ Error fetching requests:", err);
        } finally {
          setLoadingRequests(false);
        }
      };

      fetchRequests();
    }
  }, [activeTab, friendRequests.length]);

  //for getting friends list api
    const [friendsResults, setFriendsResults] = useState<UserFriend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
    useEffect(() => {
    if (activeTab === "friends") {
      fetchFriends(searchQuery);
    }
  }, [activeTab, searchQuery]);

  const fetchFriends = async (query: string) => {
    setLoadingFriends(true);
    try {
      const res = await searchFriendsApi(user?.username || "");
      if (res.success) {
        setFriendsResults(res.results);
      } else {
        setFriendsResults([]);
      }
    } catch (err) {
      console.error("Error searching friends:", err);
      setFriendsResults([]);
    } finally {
      setLoadingFriends(false);
    }
  };
  return (
    <>
      <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {!mounted ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="px-4 mb-4 pt-4">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative ${
                        activeTab === tab.id
                          ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {tab.count}
                        </span>
                      )}
                     
                    </button>
                  );
                })}
              </div>
              {activeTab === "friends" && (
                // Search
                <div className="pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search friends..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "chats" && (
                  <ChatList
                    searchQuery={searchQuery}
                    conversations={conversations}
                    friendsWithoutConversation={friendsWithoutConversation}
                  />
                )}
                {activeTab === "requests" && (
                  <FriendRequests
                    requests={friendRequests}
                    loading={loadingRequests}
                  />
                )}
                {activeTab === "friends" && (
          <FriendsList searchQuery={searchQuery} friends={friendsResults} loading={loadingFriends} />
        )}
              </motion.div>
            </div>

            {/* New Chat Button */}
            {/* {activeTab === "chats" && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Start New Chat</span>
                </motion.button>
              </div>
            )} */}
          </>
        )}
      </div>
    </>
  );
}
