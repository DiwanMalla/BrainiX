"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

interface ResetCodeFormProps {
  setIsResetting: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
  onCodeVerified: (email: string) => void; // Callback to pass verified email
}

export default function ResetCodeForm({
  setIsResetting,
  setError,
  error,
  onCodeVerified,
}: ResetCodeFormProps) {
  const { signIn, isSubmitting, setIsSubmitting } = useAuth();
  const [resetEmail, setResetEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState("");

  const handleSendCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: resetEmail,
      });
      setCodeSent(true);
    } catch (err) {
      setError(
        (err as Error).message || "Failed to send reset code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
      });

      if (
        result.status === "needs_second_factor" ||
        result.status === "complete"
      ) {
        onCodeVerified(resetEmail); // Pass email to next step
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (err) {
      setError(
        (err as Error).message === "Incorrect code"
          ? "The reset code is incorrect or has expired. Please check the code or request a new one."
          : (err as Error).message || "Failed to verify code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return codeSent ? (
    <form
      onSubmit={handleVerifyCode}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {error && (
        <div className="bg-red-100 p-3 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="reset-code" className="text-sm font-medium">
          Reset Code
        </Label>
        <Input
          id="reset-code"
          type="text"
          placeholder="Enter your code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          required
          className="block-box-input w-full h-12 text-lg font-mono border-2 border-primary/50 focus:border-primary focus:ring-0 bg-background/80 shadow-[0_0_8px_rgba(var(--primary),0.2)] transition-all duration-300 placeholder:text-muted-foreground/50"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={() => {
          setIsResetting(false);
          setCodeSent(false);
          setResetCode("");
          setError(null);
        }}
      >
        Cancel
      </Button>
    </form>
  ) : (
    <form
      onSubmit={handleSendCode}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {error && (
        <div className="bg-red-100 p-3 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="reset-email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="m@example.com"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          required
          className="block-box-input w-full h-12 text-lg font-mono border-2 border-primary/50 focus:border-primary focus:ring-0 bg-background/80 shadow-[0_0_8px_rgba(var(--primary),0.2)] transition-all duration-300 placeholder:text-muted-foreground/50"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Reset Code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={() => setIsResetting(false)}
      >
        Back to Sign In
      </Button>
    </form>
  );
}
