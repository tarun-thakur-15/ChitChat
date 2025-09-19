"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Search, Wifi } from "lucide-react";

const NotFound = () => {
  const [animationStep, setAnimationStep] = useState(0);

    // Define steps and their delays in an array
  const steps = [
    { step: 1, delay: 500 },
    { step: 2, delay: 1000 },
    { step: 3, delay: 1500 },
    { step: 4, delay: 1800 },
    { step: 5, delay: 2100 },
  ];



  useEffect(() => {
    const timers = steps.map(({ step, delay }) =>
      setTimeout(() => setAnimationStep(step), delay)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className="min-h-[calc(100vh-64.8px)] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col ">

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Bot Message 1 */}
        {animationStep >= 1 && (
          <div className="flex items-end gap-2 animate-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-chat-bubble-bot dark:bg-chat-bubble-bot rounded-full flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#374151]">
              <MessageCircle className="w-4 h-4 text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground" />
            </div>
            <div className="bg-chat-bubble-bot dark:bg-chat-bubble-bot text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md bg-white dark:bg-[#374151]">
              <p className="text-sm">Hey there! 👋</p>
            </div>
          </div>
        )}

        {/* Bot Message 2 */}
        {animationStep >= 2 && (
          <div className="flex items-end gap-2 animate-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-chat-bubble-bot dark:bg-chat-bubble-bot rounded-full flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#374151]">
              <MessageCircle className="w-4 h-4 text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground" />
            </div>
            <div className="bg-chat-bubble-bot dark:bg-chat-bubble-bot text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md bg-white dark:bg-[#374151]">
              <p className="text-sm">It looks like you're trying to access a page that doesn't exist... 🤔</p>
            </div>
          </div>
        )}

        {/* User Message */}
        {animationStep >= 3 && (
          <div className="flex items-end gap-2 justify-end animate-in slide-in-from-right duration-500">
            <div className="text-chat-bubble-user-foreground dark:text-chat-bubble-user-foreground rounded-2xl rounded-br-sm px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md bg-[#2563EB]">
              <p className="text-sm text-white">Oh no! Where did the page go? 😅</p>
            </div>
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-[#2563EB]">
              <span className="text-white text-xs font-medium">You</span>
            </div>
          </div>
        )}

        {/* Bot Response */}
        {animationStep >= 4 && (
          <div className="flex items-end gap-2 animate-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-chat-bubble-bot dark:bg-chat-bubble-bot rounded-full flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#374151]">
              <MessageCircle className="w-4 h-4 text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground" />
            </div>
            <div className="bg-chat-bubble-bot dark:bg-chat-bubble-bot text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md bg-white dark:bg-[#374151]">
              <div className="space-y-2">
                <p className="text-sm">Don't worry! Sometimes pages go on vacation too 🏖️</p>
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">404</div>
                  <p className="text-xs text-muted-foreground">Page Not Found</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Actions */}
        {animationStep >= 5 && (
          <div className="flex items-end gap-2 animate-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-chat-bubble-bot dark:bg-chat-bubble-bot rounded-full flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#374151]">
              <MessageCircle className="w-4 h-4 text-chat-bubble-bot-foreground dark:text-chat-bubble-bot-foreground" />
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs sm:max-w-sm lg:max-w-md bg-white dark:bg-[#374151]">
              <p className="text-sm mb-3">Here's what you can do:</p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2 h-8 text-xs"
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="w-3 h-3" />
                  Go back home
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2 h-8 text-xs"
                  onClick={() => window.history.back()}
                >
                  <Search className="w-3 h-3" />
                  Go back to previous page
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;