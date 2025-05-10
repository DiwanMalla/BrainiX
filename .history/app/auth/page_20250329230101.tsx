"use client";

import { Suspense } from "react";
import AuthPage from "@/components/auth/AuthPage";

export default function Auth() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}
