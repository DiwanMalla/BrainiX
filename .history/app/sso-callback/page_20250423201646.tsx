"use client";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function SSOCallback() {
  const { handleRedirectCallback, client } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completeSSO = async () => {
      try {
        console.log("Starting SSO callback with role:", role);
        console.log(
          "Redirect URL:",
          `${window.location.origin}/sso-callback?${searchParams.toString()}`
        );
        await handleRedirectCallback({
          redirectUrl: `${
            window.location.origin
          }/sso-callback?${searchParams.toString()}`,
        });

        console.log("SSO callback succeeded, checking database...");
        const checkDatabase = async (attempts = 0) => {
          if (attempts >= 20) {
            throw new Error("Database not synced after max attempts");
          }
          const response = await fetch("/api/check-user", {
            headers: {
              Authorization: `Bearer ${await client.sessions[0]?.getToken()}`,
            },
          });
          if (response.ok) {
            console.log(
              "User and InstructorProfile records ready, redirecting..."
            );
            router.push(`/set-role?role=${role}`);
            setIsLoading(false);
          } else {
            console.log("Database not ready, retrying...", { attempts });
            setTimeout(() => checkDatabase(attempts + 1), 1000);
          }
        };

        await checkDatabase();
      } catch (err) {
        console.error("SSO Callback error:", err);
        router.push(
          `/auth?tab=signin&error=${encodeURIComponent(err.message)}`
        );
        setIsLoading(false);
      }
    };

    completeSSO();
  }, [handleRedirectCallback, router, role, searchParams]);

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

export default SSOCallback;
