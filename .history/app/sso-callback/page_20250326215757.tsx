// app/sso-callback/page.tsx
"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback({
      redirectUrl: "/",
      continueSignUpUrl: "/signin",
    }).then(() => {
      router.push("/");
    });
  }, [handleRedirectCallback, router]);

  return <div>Loading...</div>;
}
