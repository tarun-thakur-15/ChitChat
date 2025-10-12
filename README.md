ChatShat (Baatein Unlimited)

A real-time chat web application for seamless conversation and connection.

-> Table of Contents

1) Features
2) Tech Stack
3) Architecture & Flow
4) Getting Started
5) Usage
6) Security & Privacy
7) Future Plans

Features:-
• Real-time messaging (one-to-one or group chats)
• User authentication / registration
• Chat history / message persistence
• Responsive UI (works on mobile & desktop)
• Privacy & security (e.g. data encryption, secure transport)
• Frequently Asked Questions / Help section
• Extensible for file sharing, media, video, etc.

Tech Stack:-
Frontend: Next.js
UI / Styling: Tailwind CSS
Backend / API: Node.js + Express
Real-time Layer: Socket.io
Database: MongoDB
Authentication:	JWT
Deployment: Vercel

Architecture & Flow:-
-> Here’s a high-level overview of how the app works:
• User Authentication: A user signs up or logs in using their credentials.
• User Discovery & Follow System: After authentication, users can search for and follow any other user.
• Mutual Connection: When the followed user accepts the follow request, both users are added to each other’s chat list, enabling them to start a private conversation.
• Real-Time Connection: Once a chat is opened, the frontend establishes a real-time connection to the backend using WebSockets (Socket.io) for instant message delivery.
• Messaging Flow: Messages are sent and received in real time. The backend validates each message, stores it in the database, and instantly broadcasts it to the recipient.
• Friend Removal & Data Handling: If either user removes the other from their friend list, their entire conversation history is automatically deleted, and they can no longer send or receive messages.
• Persistence & Offline Handling: All active conversations are stored securely so that when a user reconnects, previous messages reappear instantly.
• Dynamic UI Updates: Typing indicators, online/offline status, and read receipts update in real time for a smooth, interactive experience.

Getting Started:-
# Clone the repo
git clone https://github.com/tarun-thakur-15/ChitChat
cd chatshat
# Install dependencies
npm install
# Run development mode
npm run dev

Usage:-
• Register a new account or login with existing credentials
• Navigate to the "Chats" or "Conversations" section
• Start a chat with another user
• Send messages in real time
• upload / share files, media
• view list of past messages / history

Future Plans:-
• Voice and video chat
• Group chats
• Message reactions, GIFs and Stickers
• Notifications
• Search in chat history
• Admin / moderation tools