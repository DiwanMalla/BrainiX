"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PenTool, BookOpen } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleWriteClick = () => {
    if (!isSignedIn) {
      router.push("/auth?tab=signin");
    } else {
      router.push("/blog/create");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/blog" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            BrainiXBlog
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            size="sm"
            className="hidden sm:flex"
            onClick={handleWriteClick}
          >
            <PenTool className="mr-2 h-4 w-4" />
            Write
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="sm:hidden"
            onClick={handleWriteClick}
          >
            <PenTool className="h-4 w-4" />
          </Button>
          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
}
