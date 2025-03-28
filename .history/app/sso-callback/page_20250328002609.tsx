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
    console.log("Starting SSO callback with role:", role);
    handleRedirectCallback({
      redirectUrl: `/sso-callback?role=${role}`,
      afterSignUpUrl: "/",
    })
      .then(() => {
        console.log("SSO callback succeeded, setting role:", role);
        fetch("/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        })
          .then((response) => {
            if (!response.ok) {
              console.error(
                "Failed to set role:",
                response.status,
                response.statusText
              );
            } else {
              console.log("Role set successfully");
            }
            router.push("/");
          })
          .catch((err) => {
            console.error("Set role fetch error:", err);
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
