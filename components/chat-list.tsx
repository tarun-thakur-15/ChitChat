'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    online: boolean;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isOwn: boolean;
  };
  unreadCount: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      avatar: 'AJ',
      username: 'alice_j',
      online: true,
    },
    lastMessage: {
      content: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isOwn: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    user: {
      name: 'Bob Smith',
      avatar: 'BS',
      username: 'bobsmith',
      online: false,
    },
    lastMessage: {
      content: 'Thanks for the help earlier!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      name: 'Carol Wilson',
      avatar: 'CW',
      username: 'carol_w',
      online: true,
    },
    lastMessage: {
      content: '📸 Photo',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isOwn: false,
    },
    unreadCount: 1,
  },
];

interface ChatListProps {
  searchQuery: string;
}

export function ChatList({ searchQuery }: ChatListProps) {
  const filteredChats = mockChats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 space-y-2">
      {filteredChats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{chat.user.avatar}</span>
            </div>
            {chat.user.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {chat.user.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {chat.lastMessage.isOwn && '✓ '}
                {chat.lastMessage.content}
              </p>
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ml-2">
                  <span className="text-xs text-white font-medium">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      {filteredChats.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No chats found
        </div>
      )}
    </div>
  );
}