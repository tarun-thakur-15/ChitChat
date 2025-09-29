"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Download, X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewDrawerProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  fileName?: string;
}

export default function ImagePreviewDrawer({
  open,
  onClose,
  imageUrl,
  fileName,
}: ImagePreviewDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col bg-black w-full h-full max-w-none">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-white text-lg font-medium">Image Preview</h3>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center justify-center p-4 overflow-auto flex-1">
          <div className="relative w-full max-w-full h-auto flex justify-center">
            <Image
              src={imageUrl}
              alt={fileName || "Preview image"}
              width={1920}
              height={1080}
              className="object-contain max-h-screen"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-gray-700">
          <a
            href={imageUrl}
            download={fileName || "image.jpg"}
            className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>

          <Button variant="ghost" onClick={onClose} className="text-white">
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
