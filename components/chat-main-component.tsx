"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookies from "js-cookie";
import { useChatStore } from "@/app/stores/chatStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { mapMessage } from "@/app/utils/mapMessage";
import { SendMessageRequest } from "@/app/services/schema";
import Link from "next/link";
import { checkUserOnline, socket } from "@/socket";
import ChatSkeleton from "./ChatSkeleton";
import CallModal from "./CallModal";

//IMAGES
import Superman from "../app/images/superman_logo.webp";
import Heart from "../app/images/blueheart.webp";
import Cat from "../app/images/cat.webp";
import Couple from "../app/images/couple.webp";
import ChatShat from "../app/images/ChatShat.webp";

type FileType = "photo" | "video" | "doc" | "audio" | null;

interface Props {
  userId: string;
}

export default function ChatMainComponent({ userId }: Props) {
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  // --- Audio Call States ---
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Modal states for calling
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callerName, setCallerName] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<
    "calling" | "ringing" | "in-call" | "rejected" | "ended" | "connecting"
  >("calling");

  // -----------------------------------------------
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

  //emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native); // append emoji
    setShowEmojiPicker(false); // close picker after selection
  };
  // ---------- WEBRTC helpers ----------
  // helper to ensure we only create one PC and attach handlers
  const createPeerConnection = (peerUserId: string) => {
    // Return existing if already created
    if (peerRef.current) return peerRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Remote media container
    const remote = new MediaStream();
    setRemoteStream(remote);
    // attach immediately if audio element exists
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remote;
    }

    pc.ontrack = (event) => {
      // Add incoming tracks to the remote stream
      event.streams[0].getTracks().forEach((t) => remote.addTrack(t));
      // ensure audio element has the stream
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remote;
    };

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        socket.emit("webrtc:ice-candidate", {
          to: peerUserId,
          candidate: ev.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setInCall(true);
        setCallStatus("in-call");
        setCallModalOpen(false); // hide modal once media path is live
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        // cleanup
        handleHangUp(false);
      }
    };

    peerRef.current = pc;
    return pc;
  };

  // Caller: after callee accepts, caller creates offer
  const startCallAfterAccepted = async (calleeId: string) => {
    if (!calleeId) return;
    try {
      setCallStatus("connecting");
      const pc = createPeerConnection(calleeId);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc:offer", { to: calleeId, offer });
      // now wait for answer
    } catch (err) {
      console.error("startCallAfterAccepted error:", err);
      handleHangUp(false);
    }
  };

  // Callee: handle incoming offer
  const handleReceivedOffer = async (fromId: string, offer: any) => {
    try {
      setCallStatus("connecting");
      const pc = createPeerConnection(fromId);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc:answer", { to: fromId, answer });
      // onconnectionstatechange will pick up connected state
    } catch (err) {
      console.error("handleReceivedOffer error:", err);
      socket.emit("webrtc:reject", { from: userId, to: fromId });
      handleHangUp(false);
    }
  };

  const handleReceivedAnswer = async (answer: any) => {
    if (!peerRef.current) {
      console.warn("No peer ref to apply answer");
      return;
    }
    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleAddIceCandidate = async (candidate: any) => {
    if (!peerRef.current) return;
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn("Failed to add remote ICE candidate:", err);
    }
  };

  // Hang up: stop local tracks, close pc, notify peer (optionally)
  const handleHangUp = (notifyPeer = true) => {
    try {
      localStream?.getTracks().forEach((t) => t.stop());
    } catch (e) {}
    try {
      if (peerRef.current) {
        peerRef.current.ontrack = null;
        peerRef.current.onicecandidate = null;
        peerRef.current.onconnectionstatechange = null;
        peerRef.current.close();
      }
    } catch (e) {}
    peerRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
    setInCall(false);
    setCallModalOpen(false);
    setIsIncomingCall(false);
    setCallerName(null);
    setCallStatus("ended");

    if (notifyPeer && receiverId) {
      socket.emit("webrtc:hangup", { from: userId, to: receiverId });
    }
  };

  // ---------- Socket listeners for call flow ----------
  useEffect(() => {
    if (!socket) return;

    // Incoming call notification from server
    const onIncomingCall = ({
      from,
      callerName,
    }: {
      from: string;
      callerName?: string;
    }) => {
      setCallerName(callerName || "Unknown");
      setIsIncomingCall(true);
      setCallStatus("ringing");
      setCallModalOpen(true);
      setReceiverId(from);
    };

    // Caller side: callee rejected
    const onCallRejected = ({ from }: { from: string }) => {
      setCallStatus("rejected");
      setCallModalOpen(false);
      handleHangUp(false);
    };

    // Caller side: callee accepted → caller should start offer
    const onCallAccepted = ({ from }: { from: string }) => {
      setCallModalOpen(false);
      // 'from' is callee id; start offer flow
      startCallAfterAccepted(from);
    };

    const onOffer = async ({ from, offer }: { from: string; offer: any }) => {
      await handleReceivedOffer(from, offer);
    };

    const onAnswer = async ({
      from,
      answer,
    }: {
      from: string;
      answer: any;
    }) => {
      await handleReceivedAnswer(answer);
    };

    const onIce = async ({
      from,
      candidate,
    }: {
      from: string;
      candidate: any;
    }) => {
      await handleAddIceCandidate(candidate);
    };

    const onHangup = ({ from }: { from: string }) => {
      handleHangUp(false);
    };

    const onCallStatus = ({
      status,
      with: peerId,
    }: {
      status: string;
      with: string;
    }) => {
      setCallStatus(status as any);

      if (status === "rejected") {
        setCallModalOpen(false);
        handleHangUp(false);
      }
      if (status === "in-call") {
        setInCall(true);
        setCallModalOpen(false);
      }
      if (status === "ended") {
        handleHangUp(false);
      }
      if (status === "ringing") {
        setCallModalOpen(true);
        setIsIncomingCall(true);
      }
    };

    // register listeners (names match backend)
    socket.on("webrtc:incoming-call", onIncomingCall);
    socket.on("webrtc:call-rejected", onCallRejected);
    socket.on("webrtc:call-accepted", onCallAccepted);
    socket.on("webrtc:offer", onOffer);
    socket.on("webrtc:answer", onAnswer);
    socket.on("webrtc:ice-candidate", onIce);
    socket.on("webrtc:hangup", onHangup);
    socket.on("call-status", onCallStatus);

    return () => {
      socket.off("webrtc:incoming-call", onIncomingCall);
      socket.off("webrtc:call-rejected", onCallRejected);
      socket.off("webrtc:call-accepted", onCallAccepted);
      socket.off("webrtc:offer", onOffer);
      socket.off("webrtc:answer", onAnswer);
      socket.off("webrtc:ice-candidate", onIce);
      socket.off("webrtc:hangup", onHangup);
      socket.off("call-status", onCallStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, receiverId]);

  // cleanup on component unmount
  useEffect(() => {
    return () => {
      handleHangUp(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Outgoing call trigger (opens modal and signals peer) ----------
  const onClickCallButton = () => {
    if (!chatPartner) return;

    const calleeId = chatPartner._id;
    setReceiverId(calleeId);
    setCallerName(chatPartner.fullName);
    setIsIncomingCall(false);
    setCallStatus("calling");
    setCallModalOpen(true);

    socket.emit("webrtc:call", {
      from: userId,
      to: calleeId,
      callerName: chatPartner.fullName,
    });
  };

  // ---------- Accept / Decline handlers from modal ----------
  const onAcceptCall = () => {
    if (!receiverId) {
      console.warn("No receiverId found when accepting call");
      return;
    }
    // notify backend: from=callee (you), to=caller
    socket.emit("webrtc:accept", { from: userId, to: receiverId });

    setCallStatus("connecting");
    // Do NOT close modal yet — wait for offer/answer/connected
  };

  const onDeclineCall = () => {
    if (!receiverId) {
      setCallModalOpen(false);
      setIsIncomingCall(false);
      return;
    }
    socket.emit("webrtc:reject", { from: userId, to: receiverId });
    setCallModalOpen(false);
    setIsIncomingCall(false);
    setCallStatus("rejected");
  };

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

        let participants: any[] = [];

        // If starting a conversation
        if (activeChatType === "friend" && friendId) {
          const convRes: StartConversationResponse = await startConversationApi(
            {
              receiverId: friendId,
            }
          );
          convId = convRes.conversation._id;
          participants = convRes.conversation.participants || [];
        }

        if (!convId) return;

        setActiveConversationId(convId);

        const msgsRes = await getMessagesApi(convId, 10);

        // ✅ Always get participants from API
        if (msgsRes.conversation?.participants) {
          participants = msgsRes.conversation.participants;
        }

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
            fullName: partner.fullName || null,
            username: partner.username,
            profileImage: partner.profileImage,
          });
        } else {
          // ✅ fallback: no messages, use participants array
          if (participants.length > 0) {
            const partner = participants.find(
              (p) => p._id.toString() !== userId.toString()
            );
            if (partner) {
              setReceiverId(partner._id);
              setChatPartner({
                _id: partner._id,
                fullName: partner.fullName,
                username: partner.username,
                profileImage: partner.profileImage,
              });
            }
          }
        }
        console.log("🟢 Joining conversation:", convId);
        socket.emit("conversation:join", { conversationId: convId });

        const handleReceiveMessage = (msg: any) => {
          if (!convId) return;
          if (msg.conversation.toString() === convId.toString()) {
            setMessages((prev) => {
              const msgId = msg._id || msg.id;
              if (prev.some((m) => m.id === msgId)) return prev;
              return [...prev, mapMessage(msg, userId)];
            });
          }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("receiveMessage", (msg) => {
          console.log("📥 Received in browser:", msg);
        });

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
    if (
      !hasMoreOlderMessages ||
      !activeConversationId ||
      messages.length === 0
    ) {
      return;
    }

    setIsLoadingOlder(true);

    const el = chatRef.current;
    if (!el) return;

    const scrollHeightBefore = el.scrollHeight;

    const oldestMsg = messages[0];
    const before = oldestMsg.timestamp.toISOString();

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
    setSendMessageLoading(true);
    try {
      const file = selectedFiles[0];

      // Create a temporary preview message instantly
      const tempMessage = {
        id: "temp-" + Date.now(),
        type: fileType === "photo" ? "image" : "file",
        content: URL.createObjectURL(file), // ✅ blob preview
        fileName: file.name,
        fileSize: file.size,
        isOwn: true,
        timestamp: new Date(),
        status: "sending", // optional flag
      };

      // Show locally instantly
      // setMessages((prev: any) => [...prev, tempMessage]);
      setPreviewOpen(false);
      setSelectedFiles([]);
      scrollToBottom();

      // Send to backend
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      formData.append("message", "");
      formData.append("media", file);
      formData.append("fileType", fileType || "doc");

      const res = await sendMessageApi(formData);

      const newMsg = mapMessage(res.chat, userId);

      // ✅ Merge backend data into tempMessage, but keep the local preview URL
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempMessage.id
            ? { ...newMsg, content: m.content, status: newMsg.status } // keep blob
            : m
        )
      );
    } catch (err) {
      console.error("❌ Error sending media:", err);
      // Remove temp message if failed
      // setMessages((prev) => prev.filter((m) => !m.id.startsWith("temp-")));
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !receiverId) return;
    setSendMessageLoading(true);
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
    } finally {
      setSendMessageLoading(false);
    }
  };
  function DateBadge({ date }: { date: Date }) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let label = "";

    if (isToday) label = "Today";
    else if (isYesterday) label = "Yesterday";
    else
      label = date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    return (
      <div className="flex justify-center my-4">
        <div className="bg-[#1D1F1F] rounded-[6px] text-center px-3 py-1">
          <span className="text-[12px] text-white">{label}</span>
        </div>
      </div>
    );
  }

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!receiverId) return;

    checkUserOnline(receiverId).then((status) => {
      setIsOnline(status);
    });

    socket.on("user:status", ({ userId: changedUserId, online }) => {
      if (changedUserId === receiverId) {
        setIsOnline(online);
      }
    });

    return () => {
      socket.off("user:status");
    };
  }, [receiverId]);

  // 🎨 render bubbles
  let lastMessageDate: string | null = null;

  const handleRemoveMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const renderMessages = () =>
    loadingMessages ? (
      <ChatSkeleton />
    ) : (
      messages.map((bubbleMsg, index) => {
        const messageDate = new Date(bubbleMsg.timestamp).toDateString();
        const showDateBadge = messageDate !== lastMessageDate;
        lastMessageDate = messageDate;

        return (
          <motion.div
            key={bubbleMsg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {showDateBadge && <DateBadge date={bubbleMsg.timestamp} />}
            <ChatBubble
              message={bubbleMsg}
              key={bubbleMsg.id}
              onUnsend={() => handleRemoveMessage(bubbleMsg.id)}
            />
          </motion.div>
        );
      })
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
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <Image
              src={ChatShat}
              alt="ChatShat"
              height={128}
              width={128}
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to ChatShat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Select a chat from the sidebar to start messaging.
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
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={chatPartner?.profileImage || ""}
                    height={40}
                    width={40}
                    alt={chatPartner?.username || "User"}
                    className="object-cover h-10 w-10 rounded-full"
                  />
                  <AvatarFallback>
                    {chatPartner
                      ? chatPartner.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                {/* only when user is online */}
                {/* {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )} */}
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
            <button
              onClick={onClickCallButton}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
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
                    icon: <Music className="w-6 h-6 text-purple-500" />,
                    label: "Audio",
                    onClick: () => handlePickFile("audio"),
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
                    ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp,.svg,.ico,.mp4,.mkv,.mov,.avi,.mp3,.wav,.ogg,.aac"
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
            {sendMessageLoading ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-14 right-3 z-50"
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                />
              </div>
            )}
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
      {/* Hidden audio tag for playing remote audio */}
      <audio ref={remoteAudioRef} autoPlay playsInline />
      {/* Call Modal */}
      <CallModal
        open={callModalOpen}
        isIncoming={isIncomingCall}
        callerName={callerName || (chatPartner?.fullName ?? "")}
        status={callStatus}
        onAccept={onAcceptCall}
        onDecline={onDeclineCall}
      />
      {/* in-call small control (shows when inCall true) */}
      {inCall && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-lg flex items-center gap-3">
          <div className="text-sm font-medium">
            {chatPartner?.fullName ?? "In Call"}
          </div>
          <button
            onClick={() => handleHangUp(true)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
}
