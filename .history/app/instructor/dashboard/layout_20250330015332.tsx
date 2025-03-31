import { ReactNode } from "react";
import { Tabs } from "@/components/ui/tabs";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const tabs = [
    { label: "Courses", href: "/dashboard/courses" },
    { label: "Students", href: "/dashboard/students" },
  ];

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
      <Tabs tabs={tabs} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
