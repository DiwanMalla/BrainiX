"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: "/", // Where to go after success
      continueSignUpUrl: "/signup", // Optional: for incomplete signups
    })
      .then((result) => {
        if (result.status === "complete") {
          router.push("/");
        } else {
          console.error("SSO Callback failed:", result);
          router.push("/auth"); // Redirect back to auth page on failure
        }
      })
      .catch((err) => {
        console.error("SSO Callback error:", err);
        router.push("/auth");
      });
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
