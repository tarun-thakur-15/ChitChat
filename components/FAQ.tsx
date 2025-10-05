"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is ChatShat?",
    answer: (
      <>
        ChatShat is a live chatting web app that lets people connect and
        communicate instantly in real time. It’s lightweight, fast, and built
        from scratch using modern technologies like Next.js, Node.js, and
        Socket.io. You can send messages, share media, and chat with anyone
        without unnecessary clutter.
      </>
    ),
  },
  {
    question: "Are my chats private?",
    answer: (
      <>
        Yes. your messages on ChatShat are kept private and handled securely. We
        store conversations safely in our database so they can be delivered
        reliably and accessed later if needed. ChatShat does not sell, share, or
        use your messages for advertising or tracking purposes. While chats are
        not end-to-end encrypted, we take all reasonable steps to protect your
        data from unauthorized access.
      </>
    ),
  },
  {
    question: "Can I share images, videos, or documents?",
    answer: (
      <>
        Absolutely! ChatShat supports sending media files like images, videos,
        audio, and documents. Files are uploaded safely and delivered through
        our system so that the receiver can view or download them seamlessly.
      </>
    ),
  },
  {
    question: "Do I need to create an account to chat?",
    answer: (
      <>
        Yes — you’ll need to create a simple account with your name, email, and
        password. This helps us keep your data safe and lets you access your
        chats anytime. We don’t ask for unnecessary information — just enough to
        make chatting secure and smooth.
      </>
    ),
  },
  {
    question: "Is ChatShat free to use?",
    answer: (
      <>
        Yes, 100%! ChatShat is a free, non-commercial project built purely for
        learning and connecting people. There are no hidden charges, ads, or
        premium plans — it’s open for everyone.
      </>
    ),
  },
  {
    question: "What should I do if something isn’t working?",
    answer: (
      <>
        If you face a bug, connection issue, or message delay, you can report it
        via support@chatshat.com . Since ChatShat is continuously improving,
        your feedback really helps make it better for everyone!
      </>
    ),
  },
  {
    question: "Will new features be added in the future?",
    answer: (
      <>
        Yes! ChatShat is an evolving project. Future updates may include read
        receipts, typing indicators, message reactions, and mobile optimization.
        Stay tuned — it’s just the beginning. 😊
      </>
    ),
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            💬 Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Everything you might want to know about ChatShat — quick and simple.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="text-gray-500 dark:text-gray-400 w-6 h-6" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-gray-200/40 dark:from-gray-800/30 pointer-events-none"></div>
    </section>
  );
}
