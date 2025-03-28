"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: `/sso-callback?role=${role}`,
    })
      .then(async (result) => {
        if (result.status === "complete") {
          // Set role in Clerk's public metadata
          await fetch("/api/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          });
          router.push("/");
        } else {
          console.error("SSO Callback failed:", result);
          router.push("/auth");
        }
      })
      .catch((err) => {
        console.error("SSO Callback error:", err);
        router.push("/auth");
      });
  }, [handleRedirectCallback, router, role]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
