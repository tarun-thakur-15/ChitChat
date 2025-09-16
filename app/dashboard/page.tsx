"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatMainComponent from "@/components/chat-main-component";
import ChatListOuter from "@/components/chat-list-outer";

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

export default function Dashboard() {
  const [isChatSelected, setIsChatSelected] = useState(true);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  if (isLargeScreen === null) return null;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      {isLargeScreen ? (
        <ResizablePanelGroup direction="horizontal" className="h-screen">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <ChatListOuter />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={80}
            minSize={50}
            className="!overflow-visible"
          >
            {isChatSelected ? (
              <ChatMainComponent />
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
                    Welcome to ChatWave
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Select a chat from the sidebar to start messaging, or create
                    a new conversation to connect with friends.
                  </p>
                </motion.div>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ChatListOuter />
      )}
    </div>
  );
}
