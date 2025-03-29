"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/instructor/login") {
      setIsLoading(false);
      return;
    }

    // Check if instructor is authenticated

    if (!isAuth) {
      router.push("/instructor/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Show nothing while checking authentication
  if (isLoading && pathname !== "/instructor/login") {
    return null;
  }

  return <>{children}</>;
}
