"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PenTool, BookOpen, Search, Bell } from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  totalViews: number;
  _count: {
    likes: number;
    comments: number;
  };
}

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function Header() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch posts as user types (debounced)
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setPosts([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    fetch(`/api/blog/search?query=${encodeURIComponent(debouncedSearch)}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        if (search.trim()) setShowDropdown(true);
      })
      .catch(() => setPosts([]))
      .finally(() => setSearchLoading(false));
  }, [debouncedSearch, search]);

  // Hide dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleWriteClick = () => {
    if (!isSignedIn) {
      router.push("/auth?tab=signin");
    } else {
      router.push("/blog/create");
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setShowDropdown(false);
    router.push(`/blog/search?query=${encodeURIComponent(search.trim())}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (newValue.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const DROPDOWN_LIMIT = 5;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/blog" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BrainiXBlog
            </span>
          </Link>

          {/* Navigation - Hidden on Mobile */}
          <nav className="hidden md:flex items-center space-x-6">
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
            >
              Trending
            </Link>
          </nav>
        </div>

        {/* Center Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex max-w-md w-full mx-6">
          <div className="relative w-full" ref={searchRef}>
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={handleSearch}
            />
            <input
              ref={searchInputRef}
              value={search}
              onChange={handleInputChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => search.trim() && setShowDropdown(true)}
              placeholder="Search articles..."
              className="pl-8 w-full bg-muted/50 focus:bg-background rounded-md py-2 pr-10 outline-none"
              aria-label="Search articles"
              autoComplete="off"
            />
            {searchLoading && (
              <span className="absolute right-2 top-2.5 h-4 w-4 animate-spin border-b-2 border-primary rounded-full" />
            )}

            {/* Search Results Dropdown */}
            {showDropdown && search.trim() && (
              <div className="absolute top-full left-0 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : posts.length > 0 ? (
                  <div className="py-2">
                    {posts.slice(0, DROPDOWN_LIMIT).map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className="flex items-start gap-3 p-3 hover:bg-muted transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Image
                          src={post.thumbnail || "/placeholder.svg"}
                          alt={post.title}
                          width={60}
                          height={40}
                          className="rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {post.excerpt ||
                              post.content?.slice(0, 60) ||
                              "No excerpt"}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            {post.tags?.slice(0, 2).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {posts.length > DROPDOWN_LIMIT && (
                      <div className="p-2 text-center text-xs text-muted-foreground border-t">
                        Showing top {DROPDOWN_LIMIT} results. Press Enter to see
                        all.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No blog posts found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
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

          {/* User Menu */}
          {isSignedIn && user && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </header>
  );
}
