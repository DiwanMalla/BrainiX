"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SetRolePage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  useEffect(() => {
    if (!isLoaded) return;
    const updateRole = async () => {
      console.log("I am at set-role useeffect", role);
      console.log(user);
      if (!user) {
        console.error("Unauthorized in SetRole");
        return router.push("/auth?tab=signin");
      }

      try {
        console.log("Updating role for user:", user.id, "to", role);

        // Get Clerk authentication token
        const token = await getToken();

        const response = await fetch("/api/set-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id, role }),
        });

        if (!response.ok) {
          throw new Error("Failed to update role");
        }

        console.log("Role updated successfully");
        router.push("/dashboard"); // Redirect to dashboard
      } catch (error) {
        console.error("Error updating role:", error);
        router.push("/auth?tab=signin");
      }
    };

    updateRole();
  }, [user, role, getToken, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
