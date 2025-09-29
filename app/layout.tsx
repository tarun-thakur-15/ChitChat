import { UserProvider } from "./context/UserContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import ProgressBar from "@/components/ProgressBar";
import { getCurrentUser } from "@/lib/getCurrentUser"; 
const inter = Inter({ subsets: ["latin"] });

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
          <UserProvider user={user}> {/* ✅ wrap children */}
            <Header isLoggedInParent={isLoggedInParent} user={user} />
            {children}
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
