"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatMainComponent from "@/components/chat-main-component";
import ChatListOuter from "@/components/chat-list-outer";
import { socket } from "@/socket";

// api
import { getConversationsApi } from "@/app/services/api";
import { GetConversationsResponse } from "../app/services/schema";
interface Props {
  userId: string;
}
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(media.matches); // set initial value
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
export default function SearchPageClientSide({ userId }: Props) {
  const [isChatListLoading, setIsChatListLoading] = useState(false);
  const [data, setData] = useState<GetConversationsResponse>({
    success: false,
    conversations: [],
    friendsWithoutConversation: [],
    totalFriendRequests: 0,
  });
  const [isChatSelected, setIsChatSelected] = useState(true);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsChatListLoading(true);
        const res = await getConversationsApi();
        console.log("getConversationsApi response:- " ,res);
        setData(res);

        // ✅ Connect socket if not already connected
        if (!socket.connected) socket.connect();

        // ✅ Join this user
        socket.emit("user:join", { userId: userId });

        // ✅ Join each conversation
        res.conversations.forEach((convo: any) => {
          socket.emit("conversation:join", { conversationId: convo._id });
        });

        // ✅ Listen for real-time conversation updates
        socket.on("conversation:update", (data) => {
          console.log("💬 Conversation updated via socket:", data);

          if (data?.conversations && data?.conversations?.length > 0) {
            setData((prev: any) => {
              const updatedConvo = data.conversations[0];
              const updatedConversations = prev.conversations.map((c: any) =>
                c._id === updatedConvo._id ? updatedConvo : c
              );
              return { ...prev, conversations: updatedConversations };
            });
          }
        });
      } catch (err) {
        console.error("❌ Error loading conversations:", err);
      } finally {
        setIsChatListLoading(false);
      }
    };

    fetchConversations();

    // Cleanup
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      socket.off("conversation:update");
    };
  }, [userId]);

  if (isLargeScreen === null) return null;
  return (
    <>
      {/* {isLargeScreen ? ( */}
        <ResizablePanelGroup direction="horizontal" className="h-screen !flex-col lg:!flex-row">
          <ResizablePanel defaultSize={30} minSize={15} maxSize={40}>
            <ChatListOuter
              conversations={data.conversations}
              friendsWithoutConversation={data.friendsWithoutConversation}
              totalFriendRequests={data.totalFriendRequests}
              isChatListLoading={isChatListLoading}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={80}
            minSize={50}
            className="!overflow-visible"
          >
            {isChatSelected ? (
              <ChatMainComponent userId={userId} />
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to ChatShat
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Select a chat from the sidebar to start messaging.
                  </p>
                </motion.div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      {/* ) : (
        <ChatListOuter
          conversations={data.conversations}
          totalFriendRequests={data.totalFriendRequests}
          friendsWithoutConversation={data.friendsWithoutConversation}
        />
      )} */}
    </>
  );
}
