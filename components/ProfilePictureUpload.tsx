import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePictureUploadProps {
  isActive: boolean;
  isCompleted: boolean;
  onComplete: (imageUrl: string) => void;
  onSkip: () => void;
  profilePicture: string | null;
}

export const ProfilePictureUpload = ({
  isActive,
  isCompleted,
  onComplete,
  onSkip,
  profilePicture,
}: ProfilePictureUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      
      // Create a URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        onComplete(imageUrl);
      }, 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className={cn(
      "relative p-8 transition-all duration-300",
      isActive ? "shadow-lg border-primary/20" : "opacity-50",
      isCompleted && "bg-success/5 border-success/30"
    )}>
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <Check className="w-4 h-4 text-success-foreground" />
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Add your profile picture
            </h2>
            <p className="text-muted-foreground mt-1">
              Step 1 of 2 • Help others recognize you
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip}
            disabled={!isActive}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </div>

        {profilePicture ? (
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              disabled={!isActive}
            >
              <Camera className="w-4 h-4 mr-2" />
              Change picture
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 mb-6 transition-colors cursor-pointer",
              isDragOver ? "border-primary bg-primary/5" : "border-border",
              !isActive && "cursor-not-allowed"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              if (isActive) setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => isActive && fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              {isUploading ? "Uploading..." : "Upload your photo"}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports: JPG, PNG, GIF up to 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={!isActive}
        />
      </div>
    </Card>
  );
};