import { ApiMessage, ChatMessage, ChatMessageResponse } from "../services/schema";

export function mapMessage(apiMsg: ApiMessage | ChatMessageResponse, userId: string): ChatMessage {
  const senderId = typeof apiMsg.sender === "string" ? apiMsg.sender : apiMsg.sender._id;

  return {
    id: apiMsg._id,
    content: apiMsg.message,
    type: apiMsg.mediaUrl
      ? apiMsg.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i)
        ? "image"
        : "file"
      : "text",
    isOwn: senderId === userId,
    timestamp: new Date(apiMsg.createdAt),
    status: apiMsg.status,
    fileName: apiMsg.mediaUrl ? apiMsg.mediaUrl.split("/").pop() : undefined,
  };
}
