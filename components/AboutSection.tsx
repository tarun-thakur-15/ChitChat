import { Button } from "./ui/button"; 
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutSectionProps {
  isActive: boolean;
  isDisabled: boolean;
  aboutText: string;
  onAboutChange: (text: string) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export const AboutSection = ({
  isActive,
  isDisabled,
  aboutText,
  onAboutChange,
  onComplete,
  onSkip,
}: AboutSectionProps) => {
  const isCompleted = aboutText.trim().length > 0;
  const wordCount = aboutText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 150;

  return (
    <Card className={cn(
      "relative p-8 transition-all duration-300",
      isDisabled ? "opacity-40 pointer-events-none" : "",
      isActive && !isDisabled ? "shadow-lg border-primary/20" : "",
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
          <div className="text-left">
            <h2 className="text-xl font-semibold text-card-foreground">
              Tell us about yourself
            </h2>
            <p className="text-muted-foreground mt-1">
              Step 2 of 2 • Share your story and interests
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip}
            disabled={isDisabled}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </div>

        <div className="text-left">
          <div className="relative">
            <Textarea
              placeholder="Write about yourself, your interests, experience, or anything you'd like others to know..."
              value={aboutText}
              onChange={(e) => onAboutChange(e.target.value)}
              disabled={isDisabled}
              className="min-h-[120px] resize-none pr-12"
              maxLength={maxWords * 6} // Rough character limit based on average word length
            />
            <div className="absolute bottom-3 right-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-muted-foreground">
              {wordCount}/{maxWords} words
            </p>
            {aboutText.trim() && (
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                onClick={onComplete}
                disabled={isDisabled}
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>

        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Complete step 1 to unlock this section
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};