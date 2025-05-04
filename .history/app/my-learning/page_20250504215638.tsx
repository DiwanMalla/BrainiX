"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  BookOpen,
  Clock,
  CheckCircle,
  ChevronRight,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";

interface PurchasedCourse {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  instructor: string;
  price: number;
  purchaseDate: string;
  progress: number;
}

export default function MyLearningPage() {
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your courses.",
        variant: "destructive",
      });
      router.push("/auth?tab=signin");
      return;
    }

    const fetchPurchasedCourses = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/courses/purchased");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch courses");
        }
        setPurchasedCourses(data);
      } catch (err: unknown) {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Unable to load your courses.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [user, router, toast]);
  console.log(purchasedCourses);
  // Filter courses based on search query and active tab
  const filteredCourses = purchasedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in-progress")
      return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === "completed")
      return matchesSearch && course.progress === 100;
    if (activeTab === "not-started")
      return matchesSearch && course.progress === 0;

    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const continueLearning = (course: PurchasedCourse) => {
    router.push(`/my-learning/${course.slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground text-lg">Loading your courses...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Learning</h1>
              <p className="text-muted-foreground mt-1">
                {purchasedCourses.length}{" "}
                {purchasedCourses.length === 1 ? "course" : "courses"} purchased
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your courses"
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {purchasedCourses.length > 0 ? (
            <>
              <Tabs
                defaultValue="all"
                className="mb-8"
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="not-started">Not Started</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto relative">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          {course.progress === 100 && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {course.instructor}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge
                                variant="outline"
                                className="flex items-center"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Purchased: {formatDate(course.purchaseDate)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                Lifetime Access
                              </Badge>
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{course.progress}% complete</span>
                              </div>
                              <Progress
                                value={course.progress}
                                className="h-2"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end mt-4 pt-4 border-t cursor-pointer">
                            <Button onClick={() => continueLearning(course)}>
                              {course.progress > 0
                                ? "Continue Learning"
                                : "Start Learning"}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No courses match your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 px-4 bg-muted/30 rounded-lg">
              <div className="inline-block p-6 rounded-full bg-muted mb-6">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                You haven't purchased any courses yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Explore our catalog and find the perfect course to start your
                learning journey.
              </p>
              <Button asChild size="lg">
                <Link href="/courses">
                  Browse Courses
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
