"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RedirectCallbackResult } from "@/types/globals";

// Define the expected result type for handleRedirectCallback

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: `/sso-callback?role=${role}`,
      afterSignUpUrl: "/", // Replace redirectUrlComplete
    })
      .then(async (result: RedirectCallbackResult) => {
        if (result.status === "complete") {
          const response = await fetch("/api/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          });
          if (!response.ok)
            console.error("Failed to set role:", await response.text());
          router.push("/");
        } else {
          console.error("SSO Callback failed:", result);
          router.push("/auth?tab=signin");
        }
      })
      .catch((err) => {
        console.error("SSO Callback error:", err);
        router.push("/auth?tab=signin");
      });
  }, [handleRedirectCallback, router, role]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
