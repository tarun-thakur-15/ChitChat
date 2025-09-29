"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Music } from "lucide-react";

type FileType = "photo" | "video" | "doc" | "audio" | null;

interface MediaPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onSend: () => Promise<void> | void; // allow async
  fileType: FileType;
  selectedFiles: File[];
}

export default function MediaPreviewModal({
  open,
  onClose,
  onSend,
  fileType,
  selectedFiles,
}: MediaPreviewModalProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    try {
      setIsSending(true);
      await onSend(); // wait for API
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-sm p-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>Preview {fileType}</DialogTitle>
        </DialogHeader>

        <div className="p-4 max-h-[60vh] overflow-auto space-y-4">
          {fileType === "photo" &&
            selectedFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full rounded-lg object-contain"
              />
            ))}

          {fileType === "video" &&
            selectedFiles.map((file, idx) => (
              <video
                key={idx}
                src={URL.createObjectURL(file)}
                controls
                className="w-full rounded-lg"
              />
            ))}

          {fileType === "doc" &&
            selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
            ))}

          {fileType === "audio" &&
            selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <Music className="w-5 h-5 text-purple-500" />
                <audio controls className="w-full">
                  <source src={URL.createObjectURL(file)} />
                </audio>
              </div>
            ))}
        </div>

        <DialogFooter className="px-4 py-2 border-t flex justify-between">
          <Button variant="ghost" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="bg-green-500 hover:bg-green-600"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
