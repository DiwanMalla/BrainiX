"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
  Search,
  X,
  ChevronRight,
  Star,
  Clock,
  BarChart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import {
  dispatchWishlistUpdate,
  listenToWishlistUpdate,
  dispatchCartUpdate,
} from "@/lib/event";
import { useCart, CartItem } from "@/lib/cart-context"; // Import cart context

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  thumbnail?: string | null;
  price: number;
  discountPrice: number | null;
  instructor: { name: string };
  rating: number;
  totalStudents: number;
  duration: number; // In minutes
  level: string;
  totalLessons: number;
  totalModules: number;
  shortDescription: string;
  tags: string[];
  language: string;
  subtitlesLanguages: string[];
  certificateAvailable: boolean;
  published: boolean;
  featured: boolean;
  bestseller: boolean;
  addedAt: string; // ISO date string
}

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const { cartItems, setCartItems } = useCart(); // Use cart context

  const [wishlistItems, setWishlistItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data: CourseItem[] = await res.json();
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({ title: "Error", description: "Failed to load wishlist" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    const unsubscribe = listenToWishlistUpdate(fetchWishlist);
    return () => unsubscribe();
  }, [user]);

  const handleRemoveFromWishlist = async (courseId: string) => {
    if (!user) {
      toast({ title: "Please sign in to manage your wishlist" });
      router.push("/auth?tab=signin");
      return;
    }

    setIsRemoving(courseId);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Failed to remove from wishlist");

      setWishlistItems(wishlistItems.filter((item) => item.id !== courseId));
      dispatchWishlistUpdate();
      toast({ title: "Removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({ title: "Error", description: "Failed to remove from wishlist" });
    } finally {
      setTimeout(() => setIsRemoving(null), 300); // Match animation duration
    }
  };

  const handleAddToCart = async (item: CourseItem) => {
    if (!user) {
      toast({ title: "Please sign in to add to cart" });
      router.push("/auth?tab=signin");
      return;
    }

    if (cartItems.some((cartItem) => cartItem.id === item.id)) {
      toast({
        title: "Already in cart",
        description: `${item.title} is already in your cart`,
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: item.id }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      const newCartItem: CartItem = await res.json();
      setCartItems([...cartItems, newCartItem]); // Update cart state
      dispatchCartUpdate(); // Notify other components
      toast({
        title: "Added to cart",
        description: `${item.title} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add to cart" });
    }
  };

  const handleAddAllToCart = async () => {
    if (!user) {
      toast({ title: "Please sign in to add to cart" });
      router.push("/auth?tab=signin");
      return;
    }

    const itemsToAdd = wishlistItems.filter(
      (item) => !cartItems.some((cartItem) => cartItem.id === item.id)
    );

    if (itemsToAdd.length === 0) {
      toast({
        title: "All items already in cart",
        description: "All courses are already in your cart",
      });
      return;
    }

    try {
      const responses = await Promise.all(
        itemsToAdd.map((item) =>
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: item.id }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`Failed to add ${item.title} to cart`);
            return res.json();
          })
        )
      );

      setCartItems([...cartItems, ...responses]); // Add all new items to cart state
      dispatchCartUpdate(); // Notify other components
      toast({
        title: "Added all to cart",
        description: `${itemsToAdd.length} course${
          itemsToAdd.length > 1 ? "s" : ""
        } added to your cart`,
      });
    } catch (error) {
      console.error("Error adding all to cart:", error);
      toast({ title: "Error", description: "Failed to add all to cart" });
    }
  };

  const filteredWishlist = wishlistItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading your wishlist...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Keep track of courses you’re interested in and add them to your cart
            when you’re ready to learn
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            {isSearching ? (
              <div className="flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your wishlist..."
                  className="pl-9 pr-9 bg-background/80 border-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-sm"
                >
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "course" : "courses"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            )}
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "grid" | "list")}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="default"
                className="w-full sm:w-auto"
                onClick={handleAddAllToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {filteredWishlist.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWishlist.map((item) => (
                <Card
                  key={item.id}
                  className={`group relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-background rounded-xl ${
                    isRemoving === item.id ? "scale-95 opacity-50" : ""
                  }`}
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-muted-foreground">
                        {item.discountPrice ? (
                          <>
                            <span className="line-through mr-1">
                              ${item.price.toFixed(2)}
                            </span>
                            ${item.discountPrice.toFixed(2)}
                          </>
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </Badge>
                      {item.bestseller && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                          Bestseller
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => router.push(`/courses/${item.slug}`)}
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      <a
                        href={`/courses/${item.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/courses/${item.slug}`);
                        }}
                        className="hover:underline"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {item.instructor.name}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="font-medium text-amber-500 mr-1">
                        {item.rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(item.rating)
                                ? "fill-amber-500 text-amber-500"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({item.totalStudents})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(item.duration)}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center">
                        <BarChart className="h-3 w-3 mr-1" />
                        {item.level}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center bg-muted/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-100"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:border-primary group-hover:text-primary transition-colors"
                      onClick={() => handleAddToCart(item)}
                      disabled={cartItems.some(
                        (cartItem) => cartItem.id === item.id
                      )}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {cartItems.some((cartItem) => cartItem.id === item.id)
                        ? "In Cart"
                        : "Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWishlist.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                    isRemoving === item.id ? "scale-98 opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg hover:text-primary transition-colors mb-1">
                          <a
                            href={`/courses/${item.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/courses/${item.slug}`);
                            }}
                          >
                            {item.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.instructor.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.shortDescription}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="font-medium text-amber-500 mr-1">
                            {item.rating.toFixed(1)}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(item.rating)
                                    ? "fill-amber-500 text-amber-500"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({item.totalStudents})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge
                            variant="secondary"
                            className="flex items-center rounded-full"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(item.duration)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center rounded-full"
                          >
                            <BarChart className="h-3 w-3 mr-1" />
                            {item.level}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="flex items-center rounded-full"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {item.totalStudents} students
                          </Badge>
                          {item.certificateAvailable && (
                            <Badge
                              variant="secondary"
                              className="flex items-center rounded-full"
                            >
                              Certificate
                            </Badge>
                          )}
                          {item.bestseller && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-500 text-white rounded-full"
                            >
                              Bestseller
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <span className="font-bold text-lg">
                          {item.discountPrice ? (
                            <>
                              <span className="line-through text-muted-foreground mr-2">
                                ${item.price.toFixed(2)}
                              </span>
                              ${item.discountPrice.toFixed(2)}
                            </>
                          ) : (
                            `$${item.price.toFixed(2)}`
                          )}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleAddToCart(item)}
                            disabled={cartItems.some(
                              (cartItem) => cartItem.id === item.id
                            )}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {cartItems.some(
                              (cartItem) => cartItem.id === item.id
                            )
                              ? "In Cart"
                              : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-muted">
            <div className="inline-block p-6 rounded-full bg-muted/50 mb-6 animate-pulse">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Add courses to your wishlist to keep track of what you want to
              learn next!
            </p>
            <Button
              size="lg"
              className="gap-2 rounded-full animate-bounce"
              onClick={() => router.push("/categories")}
            >
              Explore Courses <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
