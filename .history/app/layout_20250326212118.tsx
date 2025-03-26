import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider
import DebugStorage from "@/components/debug-storage";
import ChatIcon from "@/components/chat/chat-icon";

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
      <body className={inter.className}>
        {children}
        <ToastProvider />
        <DebugStorage />
        <ChatIcon />
      </body>
    </html>
  );
}
