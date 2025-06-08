import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../";
import { Header } from "@/components/blog/header";
// import { ThemeProvider } from "@/components/theme-provider"
// import { Header } from "@/components/header"
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainiXBlog - Share Your Stories",
  description: "A modern blog platform built with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pb-16">{children}</main>
        </div>
        {/* <Toaster /> */}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
