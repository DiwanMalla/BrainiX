"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Github, ChromeIcon as Google } from "lucide-react";

export default function AuthPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Clerk hooks
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  // Form states
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: signInData.email,
        password: signInData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect or handle successful sign-in
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsSubmitting(true);
    try {
      await signUp.create({
        emailAddress: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.name,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification();
      // Handle next steps (e.g., show verification code input)
    } catch (error) {
      console.error("Sign-up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!signIn) return;
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: resetEmail,
      });
      setResetSent(true);
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to BrainiX
          </h1>
          {isResetting ? (
            <p className="text-sm text-muted-foreground">
              {resetSent
                ? "Check your email for the reset link"
                : "Enter your email to reset your password"}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          )}
        </div>
        {isResetting ? (
          <div className="grid gap-4">
            {resetSent ? (
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-sm">
                    We've sent a password reset link to{" "}
                    <strong>{resetEmail}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    If you don't see it, check your spam folder
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsResetting(false);
                    setResetSent(false);
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="m@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsResetting(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            )}
          </div>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => setIsResetting(true)}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                  />
                </div>
                <Button disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.name}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                  />
                </div>
                <Button disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
        {!isResetting && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn?.authenticateWithRedirect({
                    strategy: "oauth_github",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                  })
                }
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn?.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                  })
                }
              >
                <Google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
