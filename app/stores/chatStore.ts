// stores/chatStore.ts
import { create } from "zustand";

interface ChatStore {
  activeChatType: "conversation" | "friend" | null;
  conversationId?: string;
  friendId?: string;
  setActiveChat: (type: "conversation" | "friend", id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeChatType: null,
  conversationId: undefined,
  friendId: undefined,
  setActiveChat: (type, id) =>
    set(() => ({
      activeChatType: type,
      conversationId: type === "conversation" ? id : undefined,
      friendId: type === "friend" ? id : undefined,
    })),
}));
