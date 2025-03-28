"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthHeader from "./AuthHeader";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerificationForm from "./VerificationForm";
import ResetPasswordForm from "./NewPasswordForm";
import SocialAuthButtons from "./SocialAuthButton";
import { CircuitBoard } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "signin";
  const role = searchParams.get("role") || "student";
  const isInstructor = role === "instructor";

  // Redirect if user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/"); // Redirect to homepage
    }
  }, [isSignedIn, router]);

  const getHeaderText = () => {
    if (isResetting) return "Reset Your Password";
    if (isVerifying) return "Verify Your Email";
    if (tab === "signup" && isInstructor) return "Become an Instructor";
    if (tab === "signup") return "Join BrainiX";
    return "Welcome Back";
  };

  const getDescription = () => {
    if (isResetting) return "Enter your email to reset your password";
    if (isVerifying) return "Enter the verification code sent to your email";
    if (tab === "signup" && isInstructor)
      return "Share your knowledge with the world";
    if (tab === "signup") return "Start learning today";
    return "Sign in to continue your journey";
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-background">
      {/* Back to Home Button */}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button
          variant="ghost"
          className="group relative rounded-full border border-border bg-background p-2 text-foreground transition-all duration-300 hover:bg-primary/5 hover:text-primary"
        >
          <span className="absolute inset-0 rounded-full border border-transparent transition-all duration-500 group-hover:border-primary/50 group-hover:animate-circuit-trace" />
          <CircuitBoard className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-105 group-hover:animate-pulse" />
          <span className="relative font-mono text-sm tracking-tight transition-all duration-300 group-hover:tracking-wider">
            Back to Home
          </span>
        </Button>
      </Link>

      {/* Main Auth Container */}
      <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] rounded-xl bg-background p-6 shadow-md ring-1 ring-border">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

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
          <Tabs value={tab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/50 p-1 shadow-inner ring-1 ring-border">
              <TabsTrigger
                value="signin"
                asChild
                className="rounded-md text-foreground transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-[0_0_8px_rgba(var(--primary),0.3)]"
              >
                <Link
                  href={`/auth?tab=signin${
                    isInstructor ? "&role=instructor" : ""
                  }`}
                >
                  Sign In
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                asChild
                className="rounded-md text-foreground transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-[0_0_8px_rgba(var(--primary),0.3)]"
              >
                <Link
                  href={`/auth?tab=signup${
                    isInstructor ? "&role=instructor" : ""
                  }`}
                >
                  Sign Up
                </Link>
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

        {/* Switch Role Link */}
        {tab === "signup" && (
          <div className="text-center text-sm">
            {isInstructor ? (
              <>
                Want to learn instead?{" "}
                <Link
                  href="/auth?tab=signup"
                  className="text-primary hover:underline"
                >
                  Join as a Student
                </Link>
              </>
            ) : (
              <>
                Want to teach?{" "}
                <Link
                  href="/auth?tab=signup&role=instructor"
                  className="text-primary hover:underline"
                >
                  Become an Instructor
                </Link>
              </>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
