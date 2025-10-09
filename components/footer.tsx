"use client";

import Image from "next/image";
import Link from "next/link";
import ChatShat from "../app/images/ChatShat.webp";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Image
            src={ChatShat} // your logo path
            alt="ChatShat"
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400 text-sm">
          <Link
            href="/creator"
            className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Creator
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 dark:text-gray-400 text-xs text-center md:text-right">
          © {new Date().getFullYear()} ChatShat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
