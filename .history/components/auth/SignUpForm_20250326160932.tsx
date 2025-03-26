import { FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { signUp, isSubmitting, setIsSubmitting } = useAuth();
  const [signUpData, setSignUpData] = useAuth().useSignUpState();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.name,
      });
      await signUp.prepareEmailAddressVerification();
      setIsVerifying(true);
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="signup" className="w-full">
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
          <div id="clerk-captcha" className="my-4"></div>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
