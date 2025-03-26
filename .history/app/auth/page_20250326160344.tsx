"use client";

import { useState } from "react";
import { useSignUp, useSetActive } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SignUpForm = () => {
  const { signUp, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [verificationCode, setVerificationCode] = useState("");

  // Handle user signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsSubmitting(true);
    setError(null); // Clear any previous errors

    try {
      const result = await signUp.create({
        emailAddress: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.name,
      });

      // Prepare for email verification
      await signUp.prepareEmailAddressVerification();

      // Show the verification form
      setIsVerifying(true);
    } catch (error: any) {
      console.error("Sign-up error:", error);
      setError(error.message || "Sign-up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!signUp) throw new Error("SignUp not initialized");

      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isVerifying ? "Verify Email" : "Sign Up"}
      </h2>

      {error && (
        <div className="bg-red-100 p-2 rounded text-red-700">{error}</div>
      )}

      {isVerifying ? (
        // Verification form
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter the code from email"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
      ) : (
        // Signup form
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SignUpForm;
