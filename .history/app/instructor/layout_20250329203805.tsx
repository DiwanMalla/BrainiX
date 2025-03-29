"use client";

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
