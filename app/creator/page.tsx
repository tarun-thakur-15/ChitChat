"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Video,
  Phone,
  Palette,
  Clock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import TarunThakur from "../../public/images/Taruncropped.webp";

export default function CreatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md"
      >
        <Image
          src={TarunThakur}
          alt="Tarun Thakur"
          width={160}
          height={160}
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* Intro Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Hey there! I’m Tarun, the creator of ChatShat. 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start">
          Hi, I’m{" "}
          <span className="font-semibold text-indigo-500">Tarun Thakur</span>,
          a passionate MERN Stack Developer and the creator of{" "}
          <span className="font-semibold text-purple-500">ChatShat</span>, a
          modern live chatting web app designed for fast, smooth, and reliable
          conversations.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          ChatShat started as a simple idea: “What if chatting online could feel
          lightweight, fast, and distraction-free built completely from
          scratch?”
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          That thought turned into nights of coding, testing, and refining — and
          finally, ChatShat was born.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          I built ChatShat as a passion project using modern web technologies
          like Next.js, Node.js, Socket.io, and MongoDB.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
         It’s designed to let people communicate in real time, whether for casual chatting, testing socket-based features, or exploring how scalable chat systems actually work.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          More than just a messaging tool, ChatShat is my way of exploring
          full-stack development, backend communication patterns, and real-world
          data handling all wrapped up in a simple, clean interface.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          I’m constantly learning, improving, and adding features (like media
          sharing, online status, and message syncing). And if this app inspires
          or helps you in any way whether as a developer or user, that’s
          mission accomplished for me. 🚀
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-start mt-4">
          If you’d like to connect, collaborate, or share feedback, feel free to
          reach out:
          <Link
            href="mailto:tarunthakur283@gmail.com"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            📧 tarunthakur283@gmail.com{" "}
          </Link>
          (or) connect via{" "}
          <Link
            href="https://www.linkedin.com/in/tarun-thakur-b4bb78274/"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            LinkedIn
          </Link>
        </p>
      </motion.div>

      {/* Upcoming Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-20 max-w-5xl text-center"
      >
        <h3 className="text-3xl font-semibold mb-6 text-indigo-500 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500" />
          Upcoming Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Phone className="w-8 h-8 text-green-500" />,
              title: "Voice Calling",
              desc: "Enjoy crystal-clear real-time voice chats with your friends directly in ChatShat.",
            },
            {
              icon: <Video className="w-8 h-8 text-red-500" />,
              title: "Video Calling",
              desc: "Seamless peer-to-peer video calls to connect face-to-face anytime.",
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
              title: "Status / Stories",
              desc: "Share your thoughts, images, or short videos that disappear after 24 hours.",
            },
            {
              icon: <Palette className="w-8 h-8 text-purple-500" />,
              title: "Custom Themes",
              desc: "Personalize your chat interface with new theme colors and gradients.",
            },
            {
              icon: <Clock className="w-8 h-8 text-yellow-500" />,
              title: "Message Scheduler",
              desc: "Schedule your messages to send automatically at a specific time.",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-pink-500" />,
              title: "AI Chat Assistant",
              desc: "Get smart replies and message suggestions powered by AI.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all border border-transparent hover:border-indigo-500"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h4 className="mt-3 font-semibold text-lg">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
