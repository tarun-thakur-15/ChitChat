"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useChatStore } from "@/app/stores/chatStore";
import { getMessagesApi, startConversationApi, sendMessageApi } from "@/app/services/api";
import { StartConversationResponse, ChatMessage } from "@/app/services/schema";
import { ChatBubble } from "@/components/chat-bubble";
import MediaPreviewModal from "./MediaPreviewModal";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mapMessage } from "@/app/utils/mapMessage";
import { SendMessageRequest } from "@/app/services/schema";

type FileType = "photo" | "video" | "doc" | "audio" | null;

interface Props {
  userId: string;
}

export default function ChatMainComponent({ userId }: Props) {
  const { activeChatType, conversationId, friendId } = useChatStore();

  // ✅ Only keep UI-ready messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<string | null>(null);

  const [mediaBoxOpen, setMediaBoxOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<FileType>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [receiverId, setReceiverId] = useState<string | null>(null);

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
    async function fetchMessages() {
      if (!activeChatType) return;

      try {
        let convId = conversationId;

        if (activeChatType === "friend" && friendId) {
          const convRes: StartConversationResponse = await startConversationApi({
            receiverId: friendId,
          });
          convId = convRes.conversation._id;
        }

        if (convId) {
          const msgsRes = await getMessagesApi(convId);

          // ✅ Map all API messages into UI shape
          setMessages(msgsRes.messages.map((m) => mapMessage(m, userId)));

          // ✅ Figure out receiverId
          if (msgsRes.messages.length > 0) {
            const firstMsg = msgsRes.messages[0];
            const rId =
              firstMsg.sender._id === userId
                ? firstMsg.receiver._id
                : firstMsg.sender._id;
            setReceiverId(rId);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, [activeChatType, conversationId, friendId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const mediaUrl = URL.createObjectURL(file); // ⚡ replace with actual upload

      const payload: SendMessageRequest = {
        receiverId,
        message: "",
        mediaUrl,
      };

      const res = await sendMessageApi(payload);

      // ✅ Map to ChatMessage before storing
      const newMsg = mapMessage(res.chat, userId);
      setMessages((prev) => [...prev, newMsg]);
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
      setMessages((prev) => [...prev, newMsg]);
      setMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // 🎨 render bubbles
  const renderMessages = () =>
    messages.map((bubbleMsg, index) => (
      <motion.div
        key={bubbleMsg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <ChatBubble message={bubbleMsg} />
      </motion.div>
    ));

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

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800 relative">
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
              onChange={(e) => setMessage(e.target.value)}
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
