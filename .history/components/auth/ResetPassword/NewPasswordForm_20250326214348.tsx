"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

interface NewPasswordFormProps {
  email: string;
  setIsResetting: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
}

export default function NewPasswordForm({
  email,
  setIsResetting,
  setError,
  error,
}: NewPasswordFormProps) {
  const { signIn, setActive, isSubmitting, setIsSubmitting } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  const handleSetNewPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: "your_verification_code", // Replace with the actual code
        password: newPassword,
      });

      if (result.status === "complete") {
        if (result.createdSessionId) {
          setActive({ session: result.createdSessionId });
          setResetComplete(true);
        } else {
          setError("Failed to create session. Please try again.");
        }
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      setError(
        (err as Error).message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto">
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-sm">Your password has been successfully reset.</p>
        </div>
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={() => setIsResetting(false)}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSetNewPassword}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {error && (
        <div className="bg-red-100 p-3 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="new-password" className="text-sm font-medium">
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="block-box-input w-full h-12 text-lg font-mono border-2 border-primary/50 focus:border-primary focus:ring-0 bg-background/80 shadow-[0_0_8px_rgba(var(--primary),0.2)] transition-all duration-300 placeholder:text-muted-foreground/50"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Resetting..." : "Set New Password"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={() => setIsResetting(false)}
      >
        Cancel
      </Button>
    </form>
  );
}
