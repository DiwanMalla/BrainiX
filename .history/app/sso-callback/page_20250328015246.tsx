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
    const completeSSO = async () => {
      try {
        console.log("Starting SSO callback with role:", role);
        await handleRedirectCallback({
          redirectUrl: `?${searchParams.toString()}`,
        });

        console.log("SSO callback succeeded, updating role...");
        // Redirect to the role-setting page (client-side)
        router.push(`/set-role?role=${role}`);
        console.log("");
      } catch (err) {
        console.error("SSO Callback error:", err);
        router.push("/auth?tab=signin");
      } finally {
        setIsLoading(false);
      }
    };

    completeSSO();
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
