'use client';

import { motion } from 'framer-motion';
import { MessageCircle, UserMinus } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen?: Date;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    username: 'alice_j',
    avatar: 'AJ',
    online: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    username: 'bobsmith',
    avatar: 'BS',
    online: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Carol Wilson',
    username: 'carol_w',
    avatar: 'CW',
    online: true,
  },
  {
    id: '4',
    name: 'David Brown',
    username: 'david_b',
    avatar: 'DB',
    online: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

interface FriendsListProps {
  searchQuery: string;
}

export function FriendsList({ searchQuery }: FriendsListProps) {
  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 space-y-2">
      {filteredFriends.map((friend, index) => (
        <motion.div
          key={friend.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{friend.avatar}</span>
            </div>
            {friend.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          
          <div className="flex-1 ml-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {friend.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{friend.username} • {friend.online ? 'Online' : 'Offline'}
            </p>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <UserMinus className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
      
      {filteredFriends.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No friends found
        </div>
      )}
    </div>
  );
}