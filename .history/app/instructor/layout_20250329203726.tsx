"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Import useAuth from Clerk
import { InstructorSidebar } from "@/components/instructor/sidebar";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
