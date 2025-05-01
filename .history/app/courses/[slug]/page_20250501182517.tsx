"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Clock,
  Users,
  BarChart,
  Globe,
  Calendar,
  CheckCircle,
  Building,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";
import CourseCard from "@/components/Card/CourseCard";
import {
  dispatchWishlistUpdate,
  listenToWishlistUpdate,
  dispatchCartUpdate,
} from "@/lib/event";
import { useCart } from "@/lib/cart-context";

interface InstructorProfile {
  title?: string;
  specialization?: string;
  biography?: string;
  averageRating?: number;
  totalStudents?: number;
  socialLinks?: { twitter?: string; linkedin?: string };
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  thumbnail: string;
  rating: number;
  students: number;
  category: string;
  level: string;
  duration: string;
  language: string;
  lastUpdated: string;
  instructor: {
    name: string;
    image: string;
    bio?: string;
    instructorProfile?: InstructorProfile;
  };
  whatYoullLearn: string[];
  syllabus: { title: string; lectures: number; duration: string }[];
  topCompanies: string[];
}

type RecommendedCourse = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  discount?: number;
  thumbnail: string;
  instructor: { name: string };
  rating: number;
  students: number;
  bestseller: boolean;
  category: { name: string };
  level: string;
};

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

// Child Client Component to handle client-side logic
function CoursePageContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const { cartItems, setCartItems } = useCart();
  const [course, setCourse] = useState<Course | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<
    RecommendedCourse[]
  >([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchCourseData = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch course");
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({ title: "Error", description: "Failed to load course data" });
    }
  }, [slug, toast]);

  const fetchRecommendedCourses = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/recommended?excludeSlug=${slug}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch recommended courses");
      const data = await res.json();
      setRecommendedCourses(data);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
    }
  }, [slug]);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setIsFavorite(false);
      setIsPurchased(false);
      return;
    }

    try {
      const [wishlistRes, enrollmentRes] = await Promise.all([
        fetch("/api/wishlist", { cache: "no-store" }),
        fetch("/api/enrollments", { cache: "no-store" }),
      ]);

      if (wishlistRes.ok) {
        const wishlist = await wishlistRes.json();
        setIsFavorite(
          !!wishlist.find((item: { id: string }) => item.id === course?.id)
        );
      }
      if (enrollmentRes.ok) {
        const enrollments = await enrollmentRes.json();
        setIsPurchased(
          !!enrollments.find((item: { id: string }) => item.id === course?.id)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [user, course?.id]);

  useEffect(() => {
    fetchCourseData();
    fetchRecommendedCourses();
    fetchUserData();
    const unsubscribeWishlist = listenToWishlistUpdate(fetchUserData);
    return () => unsubscribeWishlist();
  }, [fetchCourseData, fetchRecommendedCourses, fetchUserData]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const isInCart = cartItems.some((item) => item.id === course.id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({ title: "Please sign in to manage your wishlist" });
      router.push("/auth?tab=signin");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
        description: `Course ${
          isFavorite ? "removed from" : "added to"
        } your wishlist`,
      });
      dispatchWishlistUpdate();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({ title: "Error", description: "Failed to update wishlist" });
    }
  };

  const addToCartHandler = async () => {
    if (!user) {
      toast({ title: "Please sign in to add to cart" });
      router.push("/auth?tab=signin");
      return;
    }

    if (isInCart) {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart",
      });
      return;
    }

    setAddingToCart(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      const newCartItem = await res.json();
      setCartItems([...cartItems, newCartItem]);
      toast({
        title: "Added to cart",
        description: `${course.title} has been added to your cart`,
      });
      dispatchCartUpdate();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({ title: "Error", description: "Failed to add to cart" });
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = () => {
    addToCartHandler();
    if (user && !isInCart) router.push("/checkout");
  };

  const goToLearning = () => {
    router.push(`/my-learning/${course.slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {course.category}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {course.title}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                {course.shortDescription}
              </p>
              <div className="flex items-center space-x-4">
                <Image
                  src={
                    course.instructor.image || "/default-instructor-image.jpg"
                  }
                  alt={course.instructor.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Course Instructor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-amber-500">
                  {course.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({course.students.toLocaleString()} students)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {course.duration}
                </Badge>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {course.students.toLocaleString()} students
                </Badge>
                <Badge variant="secondary">
                  <BarChart className="mr-1 h-3 w-3" />
                  {course.level}
                </Badge>
                <Badge variant="secondary">
                  <Globe className="mr-1 h-3 w-3" />
                  {course.language}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="mr-1 h-3 w-3" />
                  Last updated {course.lastUpdated}
                </Badge>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-semibold"
                  >
                    Preview Course
                  </Button>
                </div>
              </div>
              <Card className="border-2 border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {course.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">
                          ${course.discountPrice?.toFixed(2)}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.price.toFixed(2)}
                        </span>
                        <Badge className="ml-2">Save {course.discount}%</Badge>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold">
                        ${course.price.toFixed(2)}
                      </span>
                    )}
                    <button
                      onClick={toggleFavorite}
                      className="p-3 rounded-full hover:bg-muted transition-colors relative group"
                      aria-label={
                        isFavorite ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      <Heart
                        className={`h-6 w-6 transition-all duration-300 ${
                          isFavorite
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-muted-foreground group-hover:text-red-400"
                        }`}
                      />
                      {isFavorite && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Heart
                            className="h-10 w-10 fill-red-500 text-red-500 animate-ping opacity-0"
                            style={{ animationDuration: "0.8s" }}
                          />
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {isPurchased ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={goToLearning}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <>
                        <Button className="w-full" size="lg" onClick={buyNow}>
                          Buy Now
                        </Button>
                        <Button
                          className="w-full relative overflow-hidden"
                          variant="outline"
                          size="lg"
                          onClick={addToCartHandler}
                          disabled={addingToCart || isInCart}
                        >
                          {addingToCart && (
                            <span className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <span className="h-1 w-full bg-primary/20 absolute">
                                <span
                                  className="h-full bg-primary absolute animate-[cartProgress_1s_ease-in-out]"
                                  style={{ width: "100%" }}
                                ></span>
                              </span>
                            </span>
                          )}
                          <ShoppingCart
                            className={`mr-2 h-4 w-4 ${
                              addingToCart ? "animate-bounce" : ""
                            }`}
                          />
                          {isInCart
                            ? "In Cart"
                            : addingToCart
                            ? "Adding..."
                            : "Add to Cart"}
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Full lifetime access</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Access on mobile and TV</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Certificate of completion</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-center">
                      Share this course
                    </p>
                    <div className="flex justify-center gap-4 mt-2">
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </button>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </button>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          ></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </button>
                      <button className="text-muted-foreground hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What You'll Learn Section */}
          <section className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">What You'll Learn</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.whatYoullLearn.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Syllabus Section */}
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Course Syllabus</h2>
            <Accordion type="single" collapsible className="w-full">
              {course.syllabus.map((module, index) => (
                <AccordionItem key={index} value={`module-${index}`}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4">
                    <div className="flex flex-col items-start text-left">
                      <span>{module.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {module.lectures} lectures • {module.duration}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2">
                    <p>
                      This module covers all aspects of{" "}
                      {module.title.toLowerCase()}.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You'll complete hands-on exercises and projects to
                      reinforce your learning.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Course Details and Instructor Bio */}
          <section className="mt-12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Course Details</TabsTrigger>
                <TabsTrigger value="instructor">
                  About the Instructor
                </TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent
                value="details"
                className="p-4 border rounded-md mt-4"
              >
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="mb-4">{course.description}</p>
                  <h3 className="text-xl font-semibold mb-4">
                    Who this course is for:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Students looking to master {course.category.toLowerCase()}{" "}
                      skills
                    </li>
                    <li>
                      Professionals wanting to advance their career in{" "}
                      {course.category}
                    </li>
                    <li>
                      Anyone interested in learning {course.title.toLowerCase()}{" "}
                      from scratch
                    </li>
                    <li>
                      Self-taught practitioners looking to fill knowledge gaps
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent
                value="instructor"
                className="p-4 border rounded-md mt-4"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <Image
                    src={
                      course.instructor.image || "/default-instructor-image.jpg"
                    }
                    alt={course.instructor.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {course.instructor.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {course.instructor.instructorProfile?.title ||
                        "Instructor"}{" "}
                      -{" "}
                      {course.instructor.instructorProfile?.specialization ||
                        course.category}{" "}
                      Expert
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-amber-500 mr-1" />
                        <span>
                          {course.instructor.instructorProfile?.averageRating?.toFixed(
                            1
                          ) || "N/A"}{" "}
                          Instructor Rating
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-primary mr-1" />
                        <span>
                          {course.instructor.instructorProfile?.totalStudents?.toLocaleString() ||
                            "0"}{" "}
                          Students
                        </span>
                      </div>
                    </div>
                    <p className="mt-2">
                      {course.instructor.instructorProfile?.biography ||
                        course.instructor.bio ||
                        "No biography available."}
                    </p>
                    {course.instructor.instructorProfile?.socialLinks && (
                      <div className="mt-4 flex gap-4">
                        {course.instructor.instructorProfile.socialLinks
                          .twitter && (
                          <a
                            href={
                              course.instructor.instructorProfile.socialLinks
                                .twitter
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Twitter
                          </a>
                        )}
                        {course.instructor.instructorProfile.socialLinks
                          .linkedin && (
                          <a
                            href={
                              course.instructor.instructorProfile.socialLinks
                                .linkedin
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="reviews"
                className="p-4 border rounded-md mt-4"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-amber-500">
                        {course.rating.toFixed(1)}
                      </div>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(course.rating)
                                ? "fill-amber-500 text-amber-500"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Course Rating
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-500 text-amber-500"
                              />
                            ))}
                          </div>
                          <span className="text-sm">70%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: "20%" }}
                            ></div>
                          </div>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-500 text-amber-500"
                              />
                            ))}
                            <Star className="h-4 w-4 fill-muted text-muted" />
                          </div>
                          <span className="text-sm">20%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: "7%" }}
                            ></div>
                          </div>
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-500 text-amber-500"
                              />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-muted text-muted"
                              />
                            ))}
                          </div>
                          <span className="text-sm">7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Top Companies Section */}
          <section className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">
              Top Companies Trust This Course
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {course.topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center bg-background p-4 rounded-lg shadow-sm"
                >
                  <Building className="h-6 w-6 text-primary mr-2" />
                  <span className="font-semibold">{company}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Courses Section */}
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Recommended Courses</h2>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {recommendedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id.toString()}
                  slug={course.slug}
                  title={course.title}
                  instructor={course.instructor?.name || "Unknown Instructor"}
                  rating={course.rating}
                  students={course.students}
                  price={course.price}
                  image={course.thumbnail}
                  discount={course.discount}
                  bestseller={course.bestseller}
                  category={course.category?.name || "Uncategorized"}
                  level={course.level}
                  shortDescription={course.shortDescription}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Wrapper component to handle params Promise
export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params; // Resolve the params Promise
  return <CoursePageContent slug={slug} />;
}
