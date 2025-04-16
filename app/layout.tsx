import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast/toast-provider";
import DebugStorage from "@/components/debug-storage";
import ChatIcon from "@/components/chat/chat-icon";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainiX - Online Learning Platform",
  description:
    "Learn from industry experts and gain in-demand skills with our comprehensive online courses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
          <ToastProvider />
          <DebugStorage />
          <ChatIcon />
        </body>
      </ClerkProvider>
    </html>
  );
}
