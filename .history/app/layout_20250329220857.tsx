"use client";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import DebugStorage from "@/components/debug-storage";
import ChatIcon from "@/components/chat/chat-icon";
import { ToastProvider } from "@/components/toast/toast-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Wait until mounted to render children
  }

  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <ToastProvider />
          <DebugStorage />
          <ChatIcon />
          xw
        </body>
      </ClerkProvider>
    </html>
  );
}
