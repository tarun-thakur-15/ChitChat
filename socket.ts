// socket.ts
import { io } from "socket.io-client";

// ✅ Use backend base URL (your API or socket server)
const base_url = "https://chat-shat-backend.onrender.com";

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
