"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PenTool, BookOpen, Search, Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function Header() {
  const { isSignedIn, user } = useUser();
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
      <div className="container flex h-16 items-center">
        {/* Logo Section */}
        <div className="flex items-center mr-4">
          <Link href="/blog" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BrainiXBlog
            </span>
          </Link>
        </div>

        {/* Navigation Section - Hidden on Mobile */}
        <nav className="hidden md:flex space-x-4 mr-4">
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog/categories"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/blog/trending"
            className="text-sm font-medium hover:text-primary transition-colors"
          ></Link>
            Trending
          </Link>
        </nav>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-8 w-full bg-muted/50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />

          {/* Notification Bell - Only show if signed in */}
          {isSignedIn && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          )}

          {/* Write Button */}
          <Button
            size="sm"
            className="hidden sm:flex"
            onClick={handleWriteClick}
          >
            <PenTool className="mr-2 h-4 w-4" />
            Write
          </Button>

          {/* Mobile Write Button */}
          <Button
            size="sm"
            variant="ghost"
            className="sm:hidden"
            onClick={handleWriteClick}
          >
            <PenTool className="h-4 w-4" />
          </Button>

          {/* User Menu - Only show if signed in */}
          {isSignedIn && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push("/blog/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/blog/my-posts")}
                >
                  My Posts
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/blog/drafts")}
                >
                  Drafts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
