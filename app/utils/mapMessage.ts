import {
  ApiMessage,
  ChatMessage,
  ChatMessageResponse,
} from "../services/schema";

const telegram_bot_token =
  process.env.NEXT_PUBLIC_TELEGRAM_TOKEN ||
  "8010186011:AAH3W3Hog0Fj563D_Pzm0NJZS4zPgymD5VQ";

export function mapMessage(
  apiMsg: ApiMessage | ChatMessageResponse,
  userId: string
): ChatMessage {
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

  return {
    id: apiMsg._id,
    content,
    type: apiMsg.mediaUrl
      ? apiMsg.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i)
        ? "image"
        : "file"
      : "text",
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
