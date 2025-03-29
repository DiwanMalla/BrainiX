"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Import useAuth from Clerk

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Use Clerk's authentication state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/instructor/login") {
      setIsLoading(false);
      return;
    }

    // Check if instructor is authenticated
    if (!isAuthenticated && !isAuthLoading) {
      router.push("/instructor/login"); // Redirect to login page if not authenticated
    } else {
      setIsLoading(false); // Set loading to false once authentication is checked
    }
  }, [pathname, router, isAuthenticated, isAuthLoading]);

  // Show nothing while checking authentication
  if (isLoading && pathname !== "/instructor/login") {
    return null;
  }

  return <>{children}</>;
}
