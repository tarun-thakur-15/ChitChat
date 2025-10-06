// socket.ts
import { io } from "socket.io-client";

// ✅ Use backend base URL (your API or socket server)
const base_url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

// ✅ Create socket instance (with manual connection control)
export const socket = io(base_url, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"], // 🔥 ensures stable connection
});

// ✅ Request a user's online status
export const checkUserOnline = (userId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!socket.connected) socket.connect();
    socket.emit("user:check-status", userId, (isOnline: boolean) => {
      resolve(isOnline);
    });
  });
};
