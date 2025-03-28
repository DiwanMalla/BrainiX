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
      afterSignUpUrl: "/", // Replace redirectUrlComplete
    })
      .then(() => {
        // On success, set the role
        fetch("/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        })
          .then((response) => {
            if (!response.ok) {
              console.error("Failed to set role:", response.statusText);
            }
            router.push("/");
          })
          .catch((err) => {
            console.error("Set role error:", err);
            router.push("/auth?tab=signin");
          });
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
