import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

interface ResetPasswordFormProps {
  setIsResetting: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
}

export default function ResetPasswordForm({
  setIsResetting,
  setError,
  error,
}: ResetPasswordFormProps) {
  const { signIn, setActive, isSubmitting, setIsSubmitting } = useAuth();
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: resetEmail,
      });
      setResetSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCodeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
        } else {
          setError("Failed to create session. Please try again.");
        }
        setResetComplete(true);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.message === "Incorrect code"
          ? "The reset code is incorrect or has expired. Please check the code or request a new one."
          : err.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetComplete) {
    return (
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-sm">Your password has been successfully reset.</p>
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
    );
  }

  return resetSent ? (
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  );
}
