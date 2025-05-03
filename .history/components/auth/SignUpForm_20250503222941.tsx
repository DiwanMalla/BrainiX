import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";

interface SignUpFormProps {
  setIsVerifying: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
}

export default function SignUpForm({
  setIsVerifying,
  setError,
  error,
}: SignUpFormProps) {
  const {
    signUp,
    isSubmitting,
    setIsSubmitting,
    useSignUpState,
    createPrismaUser,
    setActive,
    validateSignUpData,
  } = useAuth();
  const [signUpData, setSignUpData] = useSignUpState();
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) {
      setError("Sign-up service is unavailable.");
      return;
    }

    try {
      validateSignUpData(signUpData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input data.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Initiating Clerk sign-up with data:", signUpData);

      const signUpParams: {
        emailAddress: string;
        password: string;
        firstName: string;
        lastName: string;
      } = {
        emailAddress: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
      };

      const signUpResult = await signUp.create(signUpParams);
      console.log("Clerk sign-up result:", signUpResult);

      if (
        signUpResult.status === "complete" &&
        signUpResult.createdUserId &&
        signUpResult.createdSessionId
      ) {
        // Immediate completion (e.g., social auth or pre-verified)
        await createPrismaUser({
          id: signUpResult.createdUserId,
          email: signUpData.email,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
        });
        await setActive({ session: signUpResult.createdSessionId });
        router.push("/");
      } else {
        // Prepare email verification
        console.log("Preparing email verification");
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setIsCodeSent(true);
        setIsVerifying(true);
      }
    } catch (err: unknown) {
      console.error("Sign-up error:", err);
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setError(
          (err as any).errors?.[0]?.message ||
            "Failed to sign up. Please try again."
        );
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp || !verificationCode) {
      setError("Verification code is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Attempting email verification with code:", verificationCode);
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      console.log("Verification result:", result);

      if (
        result.status === "complete" &&
        result.createdUserId &&
        result.createdSessionId
      ) {
        await createPrismaUser({
          id: result.createdUserId,
          email: signUpData.email,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
        });
        console.log("Setting active session:", result.createdSessionId);
        await setActive({ session: result.createdSessionId });
        console.log("Navigating to homepage");
        router.push("/");
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Verification error:", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isCodeSent ? (
        <form onSubmit={handleSignUp} className="grid gap-4">
          {error && (
            <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={signUpData.firstName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={signUpData.lastName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, lastName: e.target.value })
              }
              required
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
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password (8+ characters)</Label>
            <Input
              id="password"
              type="password"
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              required
            />
          </div>
          <div id="clerk-captcha" className="my-4"></div>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="grid gap-4">
          {error && (
            <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter the code sent to your email"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      )}
    </>
  );
}
