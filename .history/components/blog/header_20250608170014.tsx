"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { PenTool, BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ModernBlog
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/create">
            <Button size="sm" className="hidden sm:flex">
              <PenTool className="mr-2 h-4 w-4" />
              Write
            </Button>
          </Link>
          <Link href="/create" className="sm:hidden">
            <Button size="sm" variant="ghost">
              <PenTool className="h-4 w-4" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
