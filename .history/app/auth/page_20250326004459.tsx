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
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState<string | null>(null); // New state for error messages

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
    setError(null); // Clear previous errors

    try {
      const payload = {
        emailAddress: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.name,
      };
      console.log("SignUp payload:", payload);
      console.log(
        "Turnstile element present:",
        !!document.getElementById("clerk-captcha")
      );

      const result = await signUp.create(payload);

      await signUp.prepareEmailAddressVerification();
    } catch (error: any) {
      console.error("Sign-up error:", error);
      const errorMessage =
        error.errors?.[0]?.message ||
        error.message ||
        "An error occurred during sign-up.";
      setError(
        errorMessage.includes("600010")
          ? "Verification failed (Error 600010). Please try again in a different browser, disable extensions, or check your network connection."
          : errorMessage.includes("found in an online data breach")
          ? "This password has been found in a data breach. Please choose a stronger, unique password."
          : errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      if (!signIn) throw new Error("SignIn not initialized");
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: resetEmail,
      });
      setResetSent(true);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      if (!signIn) throw new Error("SignIn not initialized");
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setResetComplete(true);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("Error completing password reset:", error);
      // Clerk errors typically have a `message` field
      setError(
        error.message === "Incorrect code"
          ? "The reset code is incorrect or has expired. Please check the code or request a new one."
          : error.message || "Failed to reset password. Please try again."
      );
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
              {resetComplete
                ? "Password reset successful! You can now sign in."
                : resetSent
                ? "Enter the code from your email and your new password"
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
            {resetComplete ? (
              <div className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-sm">
                    Your password has been successfully reset.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsResetting(false);
                    setResetSent(false);
                    setResetComplete(false);
                    setResetCode("");
                    setNewPassword("");
                    setError(null);
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : resetSent ? (
              <form onSubmit={handleResetCodeSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="reset-code">Reset Code</Label>
                  <Input
                    id="reset-code"
                    type="text"
                    placeholder="Enter the code from your email"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setIsResetting(false);
                    setResetSent(false);
                    setResetCode("");
                    setNewPassword("");
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
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
                {error && (
                  <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
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
                {/* Add the clerk-captcha element */}
                <div id="clerk-captcha" className="my-4"></div>
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
