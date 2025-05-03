import { FormEvent } from "react";
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
  } = useAuth();
  const [signUpData, setSignUpData] = useSignUpState();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    // Validate inputs
    if (!signUpData.firstName) {
      setError("First name is required.");
      return;
    }
    if (!signUpData.lastName) {
      setError("Last name is required.");
      return;
    }
    if (signUpData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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

      if (
        signUpResult.status === "complete" &&
        signUpResult.createdUserId &&
        signUpResult.createdSessionId
      ) {
        // Create Prisma user
        await createPrismaUser({
          id: signUpResult.createdUserId,
          email: signUpData.email,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
        });
        // Set session active
        await setActive({ session: signUpResult.createdSessionId });
        window.location.href = "/";
      } else {
        // Prepare email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setIsVerifying(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to sign up. Please try again.");
      } else {
        setError("Failed to sign up. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
