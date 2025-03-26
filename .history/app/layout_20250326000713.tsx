import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrainiX - AI Powered E-Learning Platform",
  description:
    "Personalized e-learning with AI-driven course recommendations, interactive quizzes, and real-time community engagement.",
  keywords:
    "e-learning, AI education, personalized learning, online courses, BrainiX",
  authors: [
    {
      name: "Group 6 - Diwan Malla, Prayas Acharya, Samrat Hona, Saroj Subedi",
    },
  ],
  // openGraph: {
  //   title: "BrainiX - AI Powered E-Learning Platform",
  //   description:
  //     "Discover a revolutionary e-learning experience with BrainiX, featuring AI-tailored education and interactive features.",
  //   url: "https://brainix-demo.vercel.app", // Replace with your deployed URL later
  //   siteName: "BrainiX",
  //   images: [
  //     {
  //       url: "https://brainix-demo.vercel.app/og-image.jpg", // Replace with actual image URL
  //       width: 1200,
  //       height: 630,
  //       alt: "BrainiX Platform Preview",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
