// socket.ts
import { io } from "socket.io-client";

const base_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000";

// autoConnect false so we can control when to connect
export const socket = io(base_url, {
  withCredentials: true,
  autoConnect: false,
});
