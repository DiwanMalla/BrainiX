import { FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";

interface SignInFormProps {
  setIsResetting: (value: boolean) => void;
  setError: (error: string | null) => void;
  error: string | null;
}

export default function SignInForm({
  setIsResetting,
  setError,
  error,
}: SignInFormProps) {
  const { signIn, setActive, isSubmitting, setIsSubmitting } = useAuth();
  const [signInData, setSignInData] = useAuth().useSignInState();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: signInData.email,
        password: signInData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup" disabled>
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="grid gap-4">
          {error && (
            <div className="bg-red-100 p-2 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
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
    </Tabs>
  );
}
