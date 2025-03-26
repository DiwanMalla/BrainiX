import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Github, ChromeIcon as Google } from "lucide-react";

export default function SocialAuthButtons() {
  const { signIn } = useSignIn();

  const handleSocialAuth = (strategy: "oauth_github" | "oauth_google") => {
    signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialAuth("oauth_github")}
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialAuth("oauth_google")}
        >
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </>
  );
}
