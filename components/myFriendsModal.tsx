"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MyFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MyFriendsModal({
  open,
  onOpenChange,
}: MyFriendsModalProps) {
  // Dummy data → replace with API/DB later
  const friends = [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/40?u=1" },
    { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/40?u=2" },
    { id: 3, name: "Alex Carter", avatar: "https://i.pravatar.cc/40?u=3" },
    { id: 4, name: "Emily Johnson", avatar: "https://i.pravatar.cc/40?u=4" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Friends List
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-60 pr-2">
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar>
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {friend.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {friend.name}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
