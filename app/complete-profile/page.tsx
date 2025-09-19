"use client"
import { useState } from "react";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { AboutSection } from "@/components/AboutSection";
import { StepProgress } from "@/components/StepProgress";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState("");
  const [isStep1Completed, setIsStep1Completed] = useState(false);

  const handleProfilePictureComplete = (imageUrl: string) => {
    setProfilePicture(imageUrl);
    setIsStep1Completed(true);
    setCurrentStep(2);
  };

  const handleSkipStep1 = () => {
    setIsStep1Completed(true);
    setCurrentStep(2);
  };

  const handleSkipStep2 = () => {
    // Handle completion or navigation
    console.log("Profile setup completed");
  };

  const handleStep2Complete = () => {
    // Handle completion or navigation
    console.log("Profile setup completed with:", { profilePicture, aboutText });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Set up your profile
          </h1>
          <p className="text-muted-foreground">
            Let's get to know you better with a few quick steps
          </p>
        </div>

        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} totalSteps={2} />

        {/* Profile Setup Content */}
        <div className="space-y-8">
          {/* Step 1: Profile Picture */}
          <ProfilePictureUpload
            isActive={currentStep >= 1}
            isCompleted={isStep1Completed}
            onComplete={handleProfilePictureComplete}
            onSkip={handleSkipStep1}
            profilePicture={profilePicture}
          />

          {/* Step 2: About Section */}
          <AboutSection
            isActive={currentStep >= 2}
            isDisabled={!isStep1Completed}
            aboutText={aboutText}
            onAboutChange={setAboutText}
            onComplete={handleStep2Complete}
            onSkip={handleSkipStep2}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;