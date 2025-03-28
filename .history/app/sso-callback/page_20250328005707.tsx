"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [isLoading, setIsLoading] = useState(true);

  console.log("SSO Callback - Initial role from searchParams:", role);

  useEffect(() => {
    console.log("Starting SSO callback with role:", role);
    handleRedirectCallback({
      redirectUrl: `/sso-callback?role=${role}`,
      afterSignUpUrl: "/",
    })
      .then(() => {
        console.log("SSO callback succeeded, setting role:", role);
        return fetch("/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
          credentials: "include",
        });
      })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Failed to set role:",
            response.status,
            response.statusText
          );
          throw new Error(`Set role failed: ${response.status}`);
        }
        console.log("Role set successfully");
        setIsLoading(false);
        router.push("/");
      })
      .catch((err) => {
        console.error("SSO Callback or set-role error:", err);
        setIsLoading(false);
        router.push("/auth?tab=signin");
      });
  }, [handleRedirectCallback, router, role]);

  return (
    <div className="flex h-screen items-center justify-center">
      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        "Redirecting..."
      )}
    </div>
  );
}
