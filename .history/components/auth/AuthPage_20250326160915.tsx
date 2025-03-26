"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthHeader from "./AuthHeader";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerificationForm from "./VerificationForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SocialAuthButtons from "./SocialAuthButtons";
import { Brain } from "lucide-react";

interface AuthPageProps {}

export default function AuthPage({}: AuthPageProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaderText = () => {
    if (isResetting) {
      return "Reset Your Password";
    } else if (isVerifying) {
      return "Verify Your Email";
    }
    return "Welcome to BrainiX";
  };

  const getDescription = () => {
    if (isResetting) {
      return "Enter your email to reset your password";
    } else if (isVerifying) {
      return "Enter the verification code sent to your email";
    }
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
          <>
            <SignInForm
              setIsResetting={setIsResetting}
              setError={setError}
              error={error}
            />
            <SignUpForm
              setIsVerifying={setIsVerifying}
              setError={setError}
              error={error}
            />
            <SocialAuthButtons />
          </>
        )}
      </div>
    </div>
  );
}
