import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import ProgressBar from "@/components/ProgressBar";
import { getCurrentUser } from "@/lib/getCurrentUser"; // ✅ import here

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatWave - Modern Chat Platform",
  description: "Connect, chat, and share with friends on ChatWave",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser(); // ✅ call helper
  const isLoggedInParent = !!user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ProgressBar />
          <Header isLoggedInParent={isLoggedInParent} user={user} />
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: "dark:bg-gray-800 dark:text-white",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
