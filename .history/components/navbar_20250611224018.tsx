"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Brain,
  Menu,
  Search,
  X,
  Heart,
  ShoppingCart,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { listenToWishlistUpdate, dispatchCartUpdate } from "@/lib/event";
import { useCart, CartItem } from "@/lib/cart-context";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  discount?: number;
  rating: number;
  students: number;
  bestseller: boolean;
  category: { name: string };
  level: string;
  instructor: { name: string };
}

export default function Navbar() {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const { cartItems, setCartItems, isLoading: cartLoading } = useCart();
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CartItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  const fetchData = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setEnrolledCourses([]);
      return;
    }

    try {
      const [wishlistRes, enrollmentsRes] = await Promise.all([
        fetch("/api/wishlist", { cache: "no-store" }),
        fetch("/api/enrollments", { cache: "no-store" }),
      ]);

      if (wishlistRes.ok) {
        setWishlistItems(await wishlistRes.json());
      } else {
        console.error("Wishlist fetch failed:", wishlistRes.status);
      }

      if (enrollmentsRes.ok) {
        setEnrolledCourses(await enrollmentsRes.json());
      } else {
        console.error("Enrollments fetch failed:", enrollmentsRes.status);
      }
    } catch (error) {
      console.error("Error fetching navbar data:", error);
      toast({ title: "Error", description: "Failed to load data" });
    }
  }, [user, toast, setWishlistItems, setEnrolledCourses]);

  useEffect(() => {
    fetchData();
    const unsubscribeWishlist = listenToWishlistUpdate(fetchData);
    return () => unsubscribeWishlist();
  }, [user]);

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Failed to remove from cart");

      setCartItems(cartItems.filter((item) => item.id !== courseId));
      toast({ title: "Removed from cart", description: "Course removed" });
      dispatchCartUpdate();
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({ title: "Error", description: "Failed to remove from cart" });
    }
  };

  useOnClickOutside<HTMLDivElement>(searchRef, () => {
    setShowSearch(false);
    setSearchQuery("");
    setCourses([]);
  });

  const searchCourses = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setCourses([]);
        return;
      }

      try {
        setIsSearching(true);
        const res = await fetch(`/api/courses`);
        if (!res.ok) throw new Error("Failed to fetch courses");

        const allCourses = await res.json();
        const filtered = allCourses.filter(
          (course: Course) =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.shortDescription
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            course.category.name.toLowerCase().includes(query.toLowerCase())
        );

        setCourses(filtered);
      } catch (error) {
        console.error("Error searching courses:", error);
        toast({ title: "Error", description: "Failed to search courses" });
      } finally {
        setIsSearching(false);
      }
    },
    [toast]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Brain className="h-6 w-6 text-primary" />
                  BrainiX
                </Link>
                <Link
                  href="/courses"
                  className="text-lg hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/categories"
                  className="text-lg hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/my-learning"
                  className="text-lg hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Learning
                </Link>
                <Link
                  href="/about"
                  className="text-lg hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                {user?.publicMetadata.role !== "instructor" && (
                  <Link
                    href="/auth?tab=signup&role=instructor"
                    className="text-lg hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become an Instructor
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Brain className="h-6 w-6 text-primary" />
            <span className="hidden md:inline">BrainiX</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {categories.map((category) => (
                      <NavigationMenuLink asChild key={category.name}>
                        <Link
                          href={category.href}
                          className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">
                            {category.name}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/categories"
                  className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Categories
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/my-learning"
                  className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  My Learning
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section: Search, Icons, Auth */}
        <div className="flex items-center gap-3">
          {showSearch ? (
            <div ref={searchRef} className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-[300px] md:w-[400px] pr-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchCourses(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/courses?search=${encodeURIComponent(
                        searchQuery.trim()
                      )}`
                    );
                    setShowSearch(false);
                    setSearchQuery("");
                    setCourses([]);
                  }
                }}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setCourses([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="py-2">
                      {courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.slug}`}
                          className="flex items-start gap-3 p-3 hover:bg-muted transition-colors"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            setCourses([]);
                          }}
                        >
                          <Image
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            width={80}
                            height={60}
                            className="rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {course.title}
                              </h3>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-sm font-bold">
                                  $
                                  {course.discount
                                    ? (
                                        course.price *
                                        (1 - course.discount / 100)
                                      ).toFixed(2)
                                    : course.price.toFixed(2)}
                                </span>
                                {course.discount && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    ${course.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {course.shortDescription}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {course.category.name}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {course.level.replace(/_/g, " ")}
                              </Badge>
                              {course.bestseller && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-yellow-500"
                                >
                                  Bestseller
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No courses found
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Popover open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5 hover:text-red-500 transition-colors" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 border-b flex justify-between">
                <h3 className="font-medium">
                  Wishlist ({wishlistItems.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/wishlist")}
                >
                  View All
                </Button>
              </div>
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted"
                  >
                    <Link
                      href={`/courses/${item.slug}`}
                      className="flex-shrink-0"
                    >
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/courses/${item.slug}`}
                        className="text-sm font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        $
                        {item.discountPrice
                          ? item.discountPrice.toFixed(2)
                          : item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-muted-foreground">
                  Wishlist is empty
                </p>
              )}
            </PopoverContent>
          </Popover>

          <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 hover:text-primary transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 border-b flex justify-between">
                <h3 className="font-medium">Cart ({cartItems.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/cart")}
                >
                  View All
                </Button>
              </div>
              {cartLoading ? (
                <p className="p-4 text-center">Loading...</p>
              ) : cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted"
                    >
                      <Link
                        href={`/courses/${item.slug}`}
                        className="flex-shrink-0"
                      >
                        <Image
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/courses/${item.slug}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          $
                          {item.discountPrice
                            ? item.discountPrice.toFixed(2)
                            : item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="p-4 border-t">
                    <p className="flex justify-between mb-2">
                      <span>Total:</span>
                      <span className="font-bold">
                        ${totalCartPrice.toFixed(2)}
                      </span>
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => router.push("/checkout")}
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              ) : (
                <p className="p-4 text-center text-muted-foreground">
                  Cart is empty
                </p>
              )}
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className={enrolledCourses.length > 0 ? "relative" : ""}
            onClick={() => router.push("/my-learning")}
          >
            <BookOpen className="h-5 w-5" />
            {enrolledCourses.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {enrolledCourses.length}
              </span>
            )}
          </Button>

          <ThemeToggle />

          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth?tab=signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?tab=signup">Join</Link>
              </Button>
            </div>
          )}

          {user?.publicMetadata.role !== "instructor" && (
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/auth?tab=signup&role=instructor">
                Become an Instructor
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

const categories = [
  {
    name: "Web Development",
    description: "Learn to build modern web applications.",
    href: "/categories/web-development",
  },
  {
    name: "Data Science",
    description: "Master data analysis and AI.",
    href: "/categories/data-science",
  },
  {
    name: "Business",
    description: "Develop business skills.",
    href: "/categories/business",
  },
  {
    name: "Design",
    description: "Create stunning designs.",
    href: "/categories/design",
  },
];
