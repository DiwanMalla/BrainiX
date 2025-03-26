"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthHeader from "./AuthHeader";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerificationForm from "./VerificationForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SocialAuthButtons from "./SocialAuthButton";
import { Brain } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();

  // Redirect if user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to homepage
    }
  }, [isSignedIn, router]);

  const getHeaderText = () => {
    if (isResetting) return "Reset Your Password";
    if (isVerifying) return "Verify Your Email";
    return "Welcome to BrainiX";
  };

  const getDescription = () => {
    if (isResetting) return "Enter your email to reset your password";
    if (isVerifying) return "Enter the verification code sent to your email";
    return "Sign in to your account or create a new one";
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back to Home Button with Futuristic Glow */}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button
          variant="ghost"
          className="group relative overflow-hidden rounded-full border border-gray-700 bg-gray-800/50 text-gray-200 hover:text-white"
        >
          <span className="absolute inset-0 scale-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-transform duration-300 group-hover:scale-150 group-hover:opacity-20"></span>
          <Brain className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          Back to Home
        </Button>
      </Link>

      {/* Main Auth Container with Robot-Inspired Styling */}
      <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] rounded-xl bg-gray-800/80 p-6 shadow-lg ring-1 ring-gray-700/50 backdrop-blur-md">
        {/* Subtle Robot Accent (Top Glow Line) */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75"></div>

        <AuthHeader title={getHeaderText()} description={getDescription()} />

        {isResetting ? (
          <ResetPasswordForm
            setIsResetting={setIsResetting}
            setError={setError}
            error={error}
          />
        ) : isVerifying ? (
          <VerificationForm
            setIsVerifying={setIsVerifying}
            setError={setError}
            error={error}
          />
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-900/50 p-1 shadow-inner ring-1 ring-gray-700">
              <TabsTrigger
                value="signin"
                className="rounded-md text-gray-300 transition-all duration-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-md text-gray-300 transition-all duration-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(147,51,234,0.5)]"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <SignInForm
                setIsResetting={setIsResetting}
                setError={setError}
                error={error}
              />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <SignUpForm
                setIsVerifying={setIsVerifying}
                setError={setError}
                error={error}
              />
            </TabsContent>
            <SocialAuthButtons />
          </Tabs>
        )}

        {/* Subtle Robot Accent (Bottom Glow Line) */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-75"></div>
      </div>
    </div>
  );
}
