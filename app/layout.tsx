import { UserProvider } from "./context/UserContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import ProgressBar from "@/components/ProgressBar";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "ChatShat – Baatein Unlimited | Free Real-Time Chat App",
  description:
    "Join ChatShat, the free real-time chat app for unlimited conversations. Enjoy private messaging, file sharing, and a smooth, secure chatting experience. Sign up today!",
  alternates: {
    canonical: "https://chat-shat.vercel.app/",
  },
  icons: {
    icon: "https://chat-shat.vercel.app/images/ChatShat.png", // update if you have a different favicon
  },
  openGraph: {
    title: "ChatShat – Baatein Unlimited | Free Real-Time Chat App",
    description:
      "Free real-time chat app for endless conversations. Chat, share, and stay connected with ChatShat.",
    url: "https://chat-shat.vercel.app/",
    siteName: "ChatShat",
    images: [
      {
        url: "https://chat-shat.vercel.app/images/ChatShat.png", // ✅ replace with your actual preview image
        width: 1200,
        height: 630,
        alt: "ChatShat App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatShat – Baatein Unlimited | Free Real-Time Chat App",
    description:
      "Join ChatShat for unlimited real-time conversations. Enjoy private messaging, media sharing, and a seamless chat experience.",
    images: ["https://chat-shat.vercel.app/images/ChatShat.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
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
          <UserProvider user={user}>
            <Header isLoggedInParent={isLoggedInParent} user={user} />
            {children}
            {!isLoggedInParent && <Footer/>}
            
          </UserProvider>
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
