"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import MediaPreviewModal from "./MediaPreviewModal";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Send,
  Image,
  File,
  Smile,
  FileText,
  ImageIcon,
  Music,
  Contact,
} from "lucide-react";
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
import { ChatBubble } from "@/components/chat-bubble";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//IMAGES
import Superman from "../app/images/superman_logo.webp";
import Heart from "../app/images/blueheart.webp";
import Cat from "../app/images/cat.webp";
import Couple from "../app/images/couple.webp";

interface Message {
  id: string;
  content: string;
  type: "text" | "image" | "file";
  isOwn: boolean;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  fileName?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you doing today?",
    type: "text",
    isOwn: false,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: "read",
  },
  {
    id: "2",
    content:
      "I'm doing great! Just working on some new projects. How about you?",
    type: "text",
    isOwn: true,
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    status: "read",
  },
  {
    id: "3",
    content:
      "That sounds awesome! I have been learning some new technologies lately.",
    type: "text",
    isOwn: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: "read",
  },
  {
    id: "4",
    content:
      "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800",
    type: "image",
    isOwn: true,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "delivered",
  },
  {
    id: "5",
    content: "project-proposal.pdf",
    type: "file",
    isOwn: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "sent",
    fileName: "project-proposal.pdf",
  },
];

type FileType = "photo" | "video" | "doc" | "audio" | null;

export default function ChatMainComponent() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
     
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Load saved theme from cookies
    const savedTheme = Cookies.get("chatTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    Cookies.set("chatTheme", newTheme);
    setTheme(newTheme);
  };

  // --------media pin dialog box-----------
  const [mediaBoxOpen, setMediaBoxOpen] = useState(false);

  // Refs for hidden inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Handlers for file selection
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
   
    const files = e.target.files;
    if (files && files.length > 0) {
    
      // Here you can send files to backend or chat
      setMediaBoxOpen(false);
    }
  };

  const mediaOptions = [
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
  ];

  // ----------for media preview-----------
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<FileType>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file picker
  const handlePickFile = (type: FileType) => {
    setFileType(type);
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setMediaBoxOpen(false);
      setPreviewOpen(true);
    }
  };

  // Send files (simulate)
  const handleMediaSend = () => {

    setPreviewOpen(false);
    setSelectedFiles([]);
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">AJ</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Alice Johnson
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTyping ? "typing..." : "Online"}
                </p>
              </div>
            </div>
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
        className={`flex-1 overflow-y-auto p-4 space-y-4  ${
          theme === "Superman"
            ? "bg-blue-700"
            : theme === "Hearts"
            ? "bg-pink-500"
            : "bg-gray-100 dark:bg-gray-800"
        } relative`}
        style={
          theme === "Superman"
            ? {
                backgroundImage: `url(${Superman.src})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "250px",
              }
            : theme === "Hearts"
            ? {
                backgroundImage: `url(${Heart.src})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "250px",
              }
            : theme === "Cat"
            ? {
                backgroundImage: `url(${Cat.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }
            : theme === "Couple"
            ? {
                backgroundImage: `url(${Couple.src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {mockMessages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* <ChatBubble message={msg} /> */}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* media box and message Input */}
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
                {mediaOptions.map((item, idx) => (
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
