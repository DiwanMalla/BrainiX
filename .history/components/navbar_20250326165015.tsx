"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { useRouter, usePathname } from "next/navigation";
import {
  getCart,
  getWishlist,
  removeFromCart,
  getPurchasedCourses,
  addToCart,
  removeFromWishlist,
} from "@/lib/local-storage";
import type {
  CartItem,
  WishlistItem,
  PurchasedCourse,
} from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(
    []
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const { user } = useClerk();
  const { signOut } = useAuth();
  useEffect(() => {
    // Load cart and wishlist from local storage
    setCartItems(getCart());
    setWishlistItems(getWishlist());
    setPurchasedCourses(getPurchasedCourses());

    // Add event listener for storage changes
    const handleStorageChange = () => {
      setCartItems(getCart());
      setWishlistItems(getWishlist());
      setPurchasedCourses(getPurchasedCourses());
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for when we update storage ourselves
    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, []);

  // Recalculate when cart items change
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    setCartItems(getCart());

    toast({
      title: "Removed from cart",
      description: "Course has been removed from your cart",
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
    setWishlistItems(getWishlist());

    toast({
      title: "Removed from wishlist",
      description: "Course has been removed from your wishlist",
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      title: item.title,
      instructor: item.instructor,
      price: item.price,
      image: item.image,
    });

    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart`,
    });

    // Notify other components
    window.dispatchEvent(new Event("localStorageChange"));
  };

  const goToWishlist = () => {
    router.push("/wishlist");
    setIsWishlistOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl"
                >
                  <Brain className="h-6 w-6 text-primary" />
                  <span>BrainiX</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/courses"
                    className="text-lg font-medium hover:text-primary"
                  >
                    Courses
                  </Link>
                  <Link
                    href="/categories"
                    className="text-lg font-medium hover:text-primary"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/instructors"
                    className="text-lg font-medium hover:text-primary"
                  >
                    Instructors
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium hover:text-primary"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium hover:text-primary"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/my-learning"
                    className="text-lg font-medium hover:text-primary"
                  >
                    My Learning
                  </Link>
                </nav>
                {user ? (
                  <>
                    <UserButton afterSignOutUrl="/" />
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link href="/auth?tab=signin">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/auth?tab=signup">Join for Free</Link>
                    </Button>
                  </div>
                )}
              </div>
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
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <NavigationMenuLink asChild key={category.name}>
                        <Link
                          href={category.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {category.name}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/instructors" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Instructors
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/my-learning" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      pathname === "/my-learning" ? "bg-accent/50" : ""
                    }`}
                  >
                    My Learning
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-[200px] md:w-[300px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {/* My Learning */}
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${
              purchasedCourses.length > 0
                ? "after:absolute after:top-0 after:right-0 after:w-2 after:h-2 after:bg-primary after:rounded-full"
                : ""
            }`}
            onClick={() => router.push("/my-learning")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="sr-only">My Learning</span>
          </Button>

          {/* Wishlist Button */}
          <Popover open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative group"
                onClick={() => {
                  if (wishlistItems.length === 0) {
                    router.push("/wishlist");
                    return;
                  }
                }}
              >
                <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white animate-in zoom-in-50 duration-300">
                    {wishlistItems.length}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">
                  My Wishlist ({wishlistItems.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-primary hover:text-primary/80"
                  onClick={goToWishlist}
                >
                  View All
                </Button>
              </div>
              {wishlistItems.length > 0 ? (
                <div>
                  <div className="max-h-80 overflow-auto">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border-b group hover:bg-muted/50 transition-colors"
                      >
                        <Link
                          href={`/courses/${item.slug}`}
                          className="relative h-12 w-20 rounded overflow-hidden flex-shrink-0"
                          onClick={() => setIsWishlistOpen(false)}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/courses/${item.slug}`}
                            className="hover:text-primary transition-colors"
                            onClick={() => setIsWishlistOpen(false)}
                          >
                            <h4 className="text-sm font-medium truncate">
                              {item.title}
                            </h4>
                          </Link>
                          <p className="text-sm font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <Button className="w-full" onClick={goToWishlist}>
                      View Wishlist
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">
                    Your wishlist is empty
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Cart Dropdown */}
          <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative group">
                <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in-50 duration-300">
                    {cartItems.length}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">
                  Shopping Cart ({cartItems.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-primary hover:text-primary/80"
                  onClick={() => {
                    router.push("/cart");
                    setIsCartOpen(false);
                  }}
                >
                  View All
                </Button>
              </div>
              {cartItems.length > 0 ? (
                <div>
                  <div className="max-h-80 overflow-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border-b group hover:bg-muted/50 transition-colors"
                      >
                        <Link
                          href={`/courses/${item.slug}`}
                          className="relative h-12 w-20 rounded overflow-hidden flex-shrink-0"
                          onClick={() => setIsCartOpen(false)}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/courses/${item.slug}`}
                            className="hover:text-primary transition-colors"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <h4 className="text-sm font-medium truncate">
                              {item.title}
                            </h4>
                          </Link>
                          <p className="text-sm font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span>Total:</span>
                      <span className="font-bold">
                        ${totalCartPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => {
                          router.push("/cart");
                          setIsCartOpen(false);
                        }}
                      >
                        View Cart
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          router.push("/checkout");
                          setIsCartOpen(false);
                        }}
                      >
                        Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth?tab=signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?tab=signup">Join for Free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const categories = [
  {
    name: "Web Development",
    description:
      "Learn to build modern web applications with HTML, CSS, JavaScript, and more.",
    href: "/categories/web-development",
  },
  {
    name: "Data Science",
    description:
      "Master data analysis, machine learning, and AI with Python and R.",
    href: "/categories/data-science",
  },
  {
    name: "Business",
    description:
      "Develop essential business skills in marketing, finance, and management.",
    href: "/categories/business",
  },
  {
    name: "Design",
    description:
      "Create stunning designs with courses on UI/UX, graphic design, and more.",
    href: "/categories/design",
  },
];
