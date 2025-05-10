"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Chrome as Google, Loader2 } from "lucide-react";

export default function SocialAuthButtons() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const handleSocialAuth = async (
    strategy: "oauth_github" | "oauth_google",
    setLoading: (value: boolean) => void
  ) => {
    if (!isLoaded || !signIn) {
      console.error("SignIn not loaded yet");
      return;
    }

    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `/sso-callback?role=${role}`,
        redirectUrlComplete: `/set-role?role=${role}`,
      });
    } catch (err) {
      console.error(`Social login failed (${strategy}):`, err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => handleSocialAuth("oauth_github", setIsLoadingGithub)}
          disabled={!isLoaded || isLoadingGithub}
        >
          {isLoadingGithub ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Github
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => handleSocialAuth("oauth_google", setIsLoadingGoogle)}
          disabled={!isLoaded || isLoadingGoogle}
        >
          {isLoadingGoogle ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </div>
    </>
  );
}
