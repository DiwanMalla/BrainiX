import { FormEvent, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

interface VerificationFormProps {
  setIsVerifying: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
}

export default function VerificationForm({
  setIsVerifying,
  setError,
  error,
}: VerificationFormProps) {
  const { signUp, setActive, isSubmitting, setIsSubmitting } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerification = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.message === "Verification code is incorrect"
          ? "The verification code is incorrect or expired. Please check the code or request a new one."
          : err.message || "Failed to verify email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVerification} className="grid gap-4">
      {error && (
        <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="verification-code">Verification Code</Label>
        <Input
          id="verification-code"
          type="text"
          placeholder="Enter the code from your email"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify Email"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => {
          setIsVerifying(false);
          setVerificationCode("");
          setError(null);
        }}
      >
        Cancel
      </Button>
    </form>
  );
}
