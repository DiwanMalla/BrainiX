"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthHeader from "./AuthHeader";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerificationForm from "./VerificationForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SocialAuthButtons from "./SocialAuthButton"; // Fixed typo in import
import { Brain } from "lucide-react";

interface AuthPageProps {}

export default function AuthPage({}: AuthPageProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <Brain className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm
                setIsResetting={setIsResetting}
                setError={setError}
                error={error}
              />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm
                setIsVerifying={setIsVerifying}
                setError={setError}
                error={error}
              />
            </TabsContent>
            <SocialAuthButtons />
          </Tabs>
        )}
      </div>
    </div>
  );
}
