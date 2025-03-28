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
      afterSignUpUrl: `/set-role?role=${role}`, // Move role-setting to server
    })
      .then(() => {
        console.log("SSO callback succeeded");
        setIsLoading(false);
        router.push("/"); // Redirect after server handles role
      })
      .catch((err) => {
        console.error("SSO Callback error:", err);
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
