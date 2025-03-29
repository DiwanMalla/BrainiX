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
  const { isSignedIn: isAuthenticated, isLoaded: isAuthLoaded } = useAuth(); // Use Clerk's authentication state
  const [isLoading, setIsLoading] = useState(true);

  return <>{children}</>;
}
