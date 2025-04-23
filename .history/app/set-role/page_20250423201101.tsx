"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const SetRolePage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "STUDENT";
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      console.log("Waiting for Clerk to load...", { attempts });
      return;
    }

    if (!user) {
      if (attempts < 20) {
        // Retry for ~20 seconds
        const timer = setTimeout(() => setAttempts(attempts + 1), 1000);
        return () => clearTimeout(timer);
      }
      console.error("User not loaded after max attempts");
      router.push("/auth?tab=signin");
      return;
    }

    const updateRole = async () => {
      try {
        console.log("Updating role for user:", user.id, "to", role);
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
          const errorText = await response.text();
          throw new Error(`Failed to update role: ${errorText}`);
        }

        console.log("Role updated successfully");
        const redirectPath =
          role === "INSTRUCTOR" ? "/instructor/dashboard" : "/";
        console.log(`Redirecting to ${redirectPath} for role: ${role}`);

        // If INSTRUCTOR, verify InstructorProfile exists
        if (role === "INSTRUCTOR") {
          const instructorResponse = await fetch("/api/check-instructor", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!instructorResponse.ok) {
            throw new Error("InstructorProfile not found");
          }
        }

        router.push(redirectPath);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error updating role:", err.message);
        } else {
          console.error("Error updating role:", err);
        }
        if (
          err instanceof Error &&
          err.message.includes("InstructorProfile not found") &&
          attempts < 20
        ) {
          const delay = Math.min(1000 * 2 ** attempts, 5000); // Exponential backoff, max 5s
          console.log(`Retrying after ${delay}ms...`, { attempts });
          const timer = setTimeout(() => setAttempts(attempts + 1), delay);
          return () => clearTimeout(timer);
        }
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        router.push(
          `/auth?tab=signin&error=${encodeURIComponent(
            err instanceof Error ? err.message : "An unknown error occurred"
          )}`
        );
      }
    };

    updateRole();
  }, [isLoaded, user, role, getToken, router, attempts]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default SetRolePage;
