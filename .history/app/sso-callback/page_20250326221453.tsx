"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        await handleRedirectCallback({
          redirectUrl: "/",
          continueSignUpUrl: "/auth",
        });
        router.push("/");
      } catch (error) {
        console.error("Error handling redirect callback", error);
        // Optionally redirect to an error page or show a message to the user
        router.push("/auth");
      }
    };

    redirect();
  }, [handleRedirectCallback, router]);

  return <div>Loading...</div>;
}
