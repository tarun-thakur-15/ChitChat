"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookies from "js-cookie";
import { useChatStore } from "@/app/stores/chatStore";
import {
  getMessagesApi,
  startConversationApi,
  sendMessageApi,
} from "@/app/services/api";
import { StartConversationResponse, ChatMessage } from "@/app/services/schema";
import { ChatBubble } from "@/components/chat-bubble";
import MediaPreviewModal from "./MediaPreviewModal";
import { startProgress } from "@/app/utils/progress";
import {
  MessageSquare,
  Paperclip,
  Send,
  ImageIcon,
  FileText,
  Music,
  Contact,
  Smile,
  Video,
  ArrowLeft,
  Phone,
  MoreHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mapMessage } from "@/app/utils/mapMessage";
import { SendMessageRequest } from "@/app/services/schema";
import Link from "next/link";
import { socket } from "@/socket";
import ChatSkeleton from "./ChatSkeleton";

type FileType = "photo" | "video" | "doc" | "audio" | null;

interface Props {
  userId: string;
}

export default function ChatMainComponent({ userId }: Props) {
  const { activeChatType, conversationId, friendId } = useChatStore();
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [hasMoreOlderMessages, setHasMoreOlderMessages] = useState(true);

  // ✅ Only keep UI-ready messages
  const chatRef = useRef<HTMLDivElement>(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<string | null>(null);

  const [mediaBoxOpen, setMediaBoxOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<FileType>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const [receiverId, setReceiverId] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const [chatPartner, setChatPartner] = useState<{
    _id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  } | null>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load theme from cookies
  useEffect(() => {
    const savedTheme = Cookies.get("chatTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Load messages when active chat changes

  useEffect(() => {
    if (!activeChatType) return;

    let convId: string | null = conversationId ?? null;

    async function setupChat() {
      try {
        setLoadingMessages(true);
        if (activeChatType === "friend" && friendId) {
          const convRes: StartConversationResponse = await startConversationApi(
            {
              receiverId: friendId,
            }
          );
          convId = convRes.conversation._id;
        }

        if (!convId) return;

        // ✅ Save to state so other functions (like handleLoadOlder) can use it
        setActiveConversationId(convId);

        const msgsRes = await getMessagesApi(convId, 10);
        const mappedMessages = msgsRes.messages.map((m) =>
          mapMessage(m, userId)
        );
        setMessages(mappedMessages);

        if (msgsRes.messages.length > 0) {
          const firstMsg = msgsRes.messages[0];
          const partner =
            firstMsg.sender._id === userId
              ? firstMsg.receiver
              : firstMsg.sender;

          setReceiverId(partner._id);
          setChatPartner({
            _id: partner._id,
            fullName: partner.fullName,
            username: partner.username,
            profileImage: partner.profileImage,
          });
        }

        socket.emit("conversation:join", { conversationId: convId });

        const handleReceiveMessage = (msg: any) => {
          if (!convId) return;
          if (msg.conversation.toString() === convId.toString()) {
            setMessages((prev) => {
              const msgId = msg._id || msg.id;
              if (prev.some((m) => m.id === msgId)) return prev; // prevent duplicates
              return [...prev, mapMessage(msg, userId)];
            });
          }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        socket.on("messageSeen", ({ messageId }) => {
          setMessages((prev: any) =>
            prev.map((m: any) =>
              m._id === messageId ? { ...m, status: "seen" } : m
            )
          );
        });

        return () => {
          if (convId) {
            socket.emit("conversation:leave", { conversationId: convId });
          }
          socket.off("receiveMessage", handleReceiveMessage);
          socket.off("messageSeen");
        };
      } catch (error) {
        console.error("❌ Error setting up chat:", error);
      } finally {
        setLoadingMessages(false);
      }
    }

    setupChat();
  }, [activeChatType, conversationId, friendId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleLoadOlder = async () => {
  if (!hasMoreOlderMessages || !activeConversationId || messages.length === 0) {
    return console.log("inside if statement");
  }

  setIsLoadingOlder(true);

  const el = chatRef.current;
  if (!el) return;

  const scrollHeightBefore = el.scrollHeight;

  const oldestMsg = messages[0];
  const before = oldestMsg.timestamp.toISOString();

  console.log("reached just above the api call");
  const olderRes = await getMessagesApi(activeConversationId, 10, before);

  // ✅ Update hasMoreOlderMessages here
  setHasMoreOlderMessages(olderRes.pagination.hasMore);

  const olderMapped = olderRes.messages.map((m) => mapMessage(m, userId));

  setMessages((prev) => [...olderMapped, ...prev]);

  setTimeout(() => {
    if (!el) return;
    const scrollHeightAfter = el.scrollHeight;
    el.scrollTop = scrollHeightAfter - scrollHeightBefore;
    setIsLoadingOlder(false);
  }, 50);
};


  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop === 0) {
        console.log("Scrolled to top → loading older messages...");
        handleLoadOlder();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeConversationId, messages]); // reset only when conversation changes

  useEffect(() => {
    socket.on("typing", ({ senderId }) => {
      if (senderId !== userId) {
        setIsTyping(true);
      }
    });

    socket.on("typing_stop", ({ senderId }) => {
      if (senderId !== userId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("typing_stop");
    };
  }, [userId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePickFile = (type: FileType) => {
    setFileType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setMediaBoxOpen(false);
      setPreviewOpen(true);
    }
  };

  const handleMediaSend = async () => {
    if (!selectedFiles.length || !receiverId) return;

    try {
      const file = selectedFiles[0];
      const formData = new FormData();

      formData.append("receiverId", receiverId);
      formData.append("message", ""); // empty if media only
      formData.append("media", file); // matches multer backend

      const res = await sendMessageApi(formData); // ✅ still uses sendMessageApi

      const newMsg = mapMessage(res.chat, userId);
      setMessages((prev) => [...prev, newMsg]); // display new message
      setPreviewOpen(false);
      setSelectedFiles([]);
      scrollToBottom();
    } catch (err) {
      console.error("❌ Error sending media:", err);
    }
  };

  // API function to send text message
  const handleSend = async () => {
    if (!message.trim() || !receiverId) return;

    try {
      const payload: SendMessageRequest = {
        receiverId,
        message,
        mediaUrl: "",
      };

      const res = await sendMessageApi(payload);

      // ✅ Map to ChatMessage before storing
      const newMsg = mapMessage(res.chat, userId);
      // setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // 🎨 render bubbles
const renderMessages = () =>
  loadingMessages ? (
    <ChatSkeleton/>
  ) : (
    messages.map((bubbleMsg, index) => (
      <motion.div
        key={bubbleMsg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <ChatBubble message={bubbleMsg} />
      </motion.div>
    ))
  );

  // Don’t render anything if no chat is selected
  if (!activeChatType) {
    return (
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
            Select a chat from the sidebar to start messaging, or create a new
            conversation to connect with friends.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleThemeChange = (newTheme: string) => {
    Cookies.set("chatTheme", newTheme);
    setTheme(newTheme);
  };

  const handleTyping = () => {
    socket.emit("typing", { conversationId, senderId: userId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId, senderId: userId });
    }, 3000);
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
      {/* header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <Link
              href={`user/${chatPartner?.username}`}
              onClick={() => startProgress()}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                {chatPartner?.profileImage ? (
                  <Image
                    src={chatPartner.profileImage}
                    alt={chatPartner.username}
                    height={40}
                    width={40}
                    className="object-cover h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">AJ</span>
                  </div>
                )}
                {/* only when user is online */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {chatPartner?.fullName || "Chit Chat User"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 space-x-3">
                  <span>@{chatPartner?.username || "chitchatuser"}</span>
                  <span>{isTyping ? "typing..." : ""}</span>
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => handleThemeChange("Superman")}
                    >
                      Superman
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleThemeChange("Hearts")}
                    >
                      Hears
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("Cat")}>
                      Cat
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleThemeChange("Couple")}
                    >
                      Couple
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        Cookies.remove("chatTheme");
                        window.location.reload();
                      }}
                    >
                      Default
                    </DropdownMenuItem>
                    {/* Add more themes later */}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800 relative"
      >
        {isLoadingOlder && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            Loading...
          </div>
        )}
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          {/* ----media box---- */}
          <Dialog open={mediaBoxOpen} onOpenChange={setMediaBoxOpen}>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Attach</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  {
                    icon: <FileText className="w-6 h-6 text-blue-500" />,
                    label: "Document",
                    onClick: () => handlePickFile("doc"),
                  },
                  {
                    icon: <ImageIcon className="w-6 h-6 text-green-500" />,
                    label: "Photos",
                    onClick: () => handlePickFile("photo"),
                  },
                  {
                    icon: <Video className="w-6 h-6 text-red-500" />,
                    label: "Videos",
                    onClick: () => handlePickFile("video"),
                  },
                  {
                    icon: <Music className="w-6 h-6 text-purple-500" />,
                    label: "Audio",
                    onClick: () => handlePickFile("audio"),
                  },
                  {
                    icon: <Contact className="w-6 h-6 text-yellow-500" />,
                    label: "Friends",
                    onClick: () => alert("Contact upload coming soon..."),
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Hidden Inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={
                  fileType === "photo"
                    ? ".png,.jpg,.jpeg,.webp,.svg,.ico"
                    : fileType === "video"
                    ? ".mp4,.mkv,.mov,.avi"
                    : fileType === "doc"
                    ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    : fileType === "audio"
                    ? ".mp3,.wav,.ogg,.aac"
                    : "*/*"
                }
                className="hidden"
                multiple
              />
            </DialogContent>
          </Dialog>

          {/* message input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              rows={1}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            <Send className="w-5 h-5" />
          </motion.button>

          {/* Preview Modal */}
          <MediaPreviewModal
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            onSend={handleMediaSend}
            fileType={fileType}
            selectedFiles={selectedFiles}
          />
        </div>
      </div>
    </div>
  );
}
