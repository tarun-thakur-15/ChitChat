import { ApiMessage, ChatMessage, ChatMessageResponse } from "../services/schema";

export function mapMessage(
  apiMsg: ApiMessage | ChatMessageResponse,
  userId: string
): ChatMessage {
  const telegram_bot_token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
  const senderId =
    typeof apiMsg.sender === "string" ? apiMsg.sender : apiMsg.sender._id;

  let content = apiMsg.message;

  // ✅ If mediaUrl exists, check if it's a file ID or full URL
  if (apiMsg.mediaUrl) {
    if (
      apiMsg.mediaUrl.startsWith("http://") ||
      apiMsg.mediaUrl.startsWith("https://")
    ) {
      content = apiMsg.mediaUrl; // already a URL
    } else {
      // Telegram file ID → build download URL
      content = `https://api.telegram.org/file/bot${telegram_bot_token}/${apiMsg.mediaUrl}`;
    }
  }

  // ✅ Decide message type based on fileType from backend
  const detectType = (): "text" | "image" | "video" | "audio" | "file" => {
    if (!apiMsg.mediaUrl) return "text";

    // If backend sends fileType, respect it
    if ("fileType" in apiMsg && apiMsg.fileType) {
      if (apiMsg.fileType === "photo") return "image";
      if (apiMsg.fileType === "video") return "video";
      if (apiMsg.fileType === "audio") return "audio";
      if (apiMsg.fileType === "doc") return "file"; // Force document style UI
    }

    // Fallback: detect by extension
    const name =
      "fileName" in apiMsg && apiMsg.fileName
        ? apiMsg.fileName
        : apiMsg.mediaUrl;

    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return "image";
    if (/\.(mp4|mov|mkv|webm)$/i.test(name)) return "video";
    if (/\.(mp3|wav|ogg)$/i.test(name)) return "audio";

    return "file";
  };

  return {
    id: apiMsg._id,
    content,
    type: detectType(),
    fileType: "fileType" in apiMsg ? apiMsg.fileType : undefined, // ✅ persist fileType
    isOwn: senderId === userId,
    timestamp: new Date(apiMsg.createdAt),
    status: apiMsg.status,
    fileName:
      "fileName" in apiMsg && apiMsg.fileName ? apiMsg.fileName : undefined,
    fileSize:
      "fileSize" in apiMsg && apiMsg.fileSize
        ? String(apiMsg.fileSize)
        : undefined,
  };
}
