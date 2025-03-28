"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Brain,
  Menu,
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
// import {
//   getCurrentInstructor,
//   logoutInstructor,
//   type Instructor,
// } from "@/lib/instructor-auth";
import { useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export function InstructorSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   setInstructor(getCurrentInstructor());
  // }, []);

  // const handleLogout = () => {
  //   logoutInstructor();
  //   router.push("/instructor/login");
  // };

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

  const sidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/instructor/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <Brain className="h-6 w-6 text-primary" />
          <span>BrainiX</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-2">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={link.href}>
                {link.icon}
                <span className="ml-2">{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            {/* <img
              src={instructor?.avatar || "/placeholder.svg?height=40&width=40"}
              alt={instructor?.name || "Instructor"}
              className="h-full w-full object-cover"
            /> */}
          </div>
          {/* <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{instructor?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {instructor?.email}
            </p>
          </div> */}
        </div>
        {/* <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button> */}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block w-64 border-r h-screen sticky top-0 ${className}`}
      >
        {sidebarContent}
      </aside>
      <div className="lg:hidden sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        <Link
          href="/instructor/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <Brain className="h-6 w-6 text-primary" />
          <span>BrainiX</span>
        </Link>
      </div>
    </>
  );
}
