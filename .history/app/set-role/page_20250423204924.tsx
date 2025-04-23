"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const SetRolePage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [attempts, setAttempts] = useState(0);
  console.log("Setrolepage");
  useEffect(() => {
    if (!isLoaded || !user) {
      console.log("Waiting for user...", { isLoaded, user, attempts });
      if (attempts < 10) {
        const timer = setTimeout(() => setAttempts(attempts + 1), 500);
        return () => clearTimeout(timer);
      }
      console.error("User not loaded after attempts, redirecting to signin");
      router.push("/auth?tab=signin");
      return;
    }

    const updateRole = async () => {
      try {
        console.log("Updating role for user:", user.id, "to", role);
        const token = await getToken();
        console.log("Fetched token:", token);
        const response = await fetch("/api/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id, role }),
        });

        if (!response.ok) throw new Error("Failed to update role");

        console.log("Role updated successfully");
        // Redirect based on role
        const redirectPath =
          role === "instructor" ? "/instructor/dashboard" : "/";
        console.log(`Redirecting to ${redirectPath} for role: ${role}`);
        router.push(redirectPath);
      } catch (error) {
        console.error("Error updating role:", error);
        router.push("/auth?tab=signin");
      }
    };

    updateRole();
  }, [isLoaded, user, role, getToken, router, attempts]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

// Wrap SetRolePage inside Suspense
const SetRolePageWithSuspense = () => (
  <Suspense
    fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }
  >
    <SetRolePage />
  </Suspense>
);

export default SetRolePageWithSuspense;
