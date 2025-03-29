"use client";
import { useEffect, useState, Suspense } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student"; // Default role is 'student'
  const [isLoading, setIsLoading] = useState(true);

  console.log("SSO Callback - Initial role from searchParams:", role);

  useEffect(() => {
    const completeSSO = async () => {
      try {
        console.log("Starting SSO callback with role:", role);
        await handleRedirectCallback({
          redirectUrl: `?${searchParams.toString()}`,
        });

        console.log("SSO callback succeeded, waiting before redirect...");
        const timer = setTimeout(() => {
          router.push(`/set-role?role=${role}`);
          console.log("Passing role to /set-role after delay:", role);
          setIsLoading(false);
        }, 2000); // 2000ms = 2 seconds

        // Cleanup the timeout in case the component is unmounted
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("SSO Callback error:", err);
        router.push("/auth?tab=signin");
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

// Wrap the SSOCallback component in Suspense in the page itself
const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SSOCallback />
  </Suspense>
);
export default Page;
