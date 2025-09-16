'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FriendRequest {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: Date;
}

const mockRequests: FriendRequest[] = [
  {
    id: '1',
    user: {
      name: 'Emma Davis',
      username: 'emma_d',
      avatar: 'ED',
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    user: {
      name: 'Mike Brown',
      username: 'mikebrown',
      avatar: 'MB',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    user: {
      name: 'Sarah Lee',
      username: 'sarah_lee',
      avatar: 'SL',
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export function FriendRequests() {
  const handleAccept = (request: FriendRequest) => {
    toast.success(`You can now chat with ${request.user.username}`, {
      icon: '✅',
      duration: 4000,
    });
  };

  const handleDecline = (request: FriendRequest) => {
    toast.error(`Declined request from ${request.user.username}`, {
      icon: '❌',
      duration: 3000,
    });
  };

  return (
    <div className="px-4 space-y-3">
      {mockRequests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{request.user.avatar}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {request.user.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{request.user.username}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAccept(request)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecline(request)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Decline</span>
            </motion.button>
          </div>
        </motion.div>
      ))}

      {mockRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No friend requests
        </div>
      )}
    </div>
  );
}