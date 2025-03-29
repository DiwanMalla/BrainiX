"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs"; // Import Clerk hooks
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  isSheet?: boolean; // New prop to differentiate mobile vs desktop
}

export function InstructorSidebar({ isSheet = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [, setOpen] = useState(false);

  const links = [
    {
      title: "Dashboard",
      href: "/instructor/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "My Courses",
      href: "/instructor/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Students",
      href: "/instructor/students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/instructor/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/instructor/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/instructor/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Help & Support",
      href: "/instructor/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={`flex flex-col h-full ${
        isSheet ? "p-4" : "p-3 border-r w-64 h-screen"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold border-b pb-2">
        <Brain className="h-6 w-6 text-primary" />
        <span>BrainiX</span>
      </div>

      {/* Sidebar Links */}
      <ScrollArea className="flex-1 mt-4">
        {links.map((link) => (
          <Button
            key={link.href}
            variant={pathname === link.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
            onClick={() => isSheet && setOpen(false)} // Close sidebar on mobile
          >
            <Link href={link.href}>
              {link.icon}
              <span className="ml-2">{link.title}</span>
            </Link>
          </Button>
        ))}
      </ScrollArea>

      {/* User Info & Sign Out */}
      <div className="mt-auto border-t pt-4">
        {isLoaded && user ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={user.imageUrl || "/placeholder.svg"}
                alt={user.fullName || "Instructor"}
                height={40}
                width={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {user.fullName || "Instructor"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress || "No email"}
                </p>
              </div>
            </div>
            <SignOutButton>
              <Button variant="outline" className="w-full justify-start">
                Sign Out
              </Button>
            </SignOutButton>
          </>
        ) : (
          <p className="text-muted-foreground">Loading user...</p>
        )}
      </div>
    </div>
  );
}
