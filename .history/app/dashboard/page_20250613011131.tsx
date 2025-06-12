"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, BookOpen, Award } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface DashboardStats {
  totalCourses: number;
  inProgress: number;
  completed: number;
  certificates: number;
}

interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  instructor: string;
  progress: number;
  hasCertificate: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    certificates: 0,
  });
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats and courses
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // Courses and progress
        const coursesRes = await fetch("/api/courses/purchased");
        const coursesData = await coursesRes.json();
        const progressRes = await fetch("/api/courses/progress");
        const progressData = await progressRes.json();
        // Certificates (simulate: if progress 100% and hasCertificate)
        const merged = coursesData.map((course: any) => {
          const progressEntry = progressData.find(
            (p: any) => p.courseId === course.id
          );
          return {
            ...course,
            progress: progressEntry ? progressEntry.progress : 0,
            hasCertificate:
              course.certificateAvailable &&
              progressEntry &&
              progressEntry.progress === 100,
          };
        });
        setCourses(merged);
        const completed = merged.filter((c: any) => c.progress === 100).length;
        const inProgress = merged.filter(
          (c: any) => c.progress > 0 && c.progress < 100
        ).length;
        const certificates = merged.filter((c: any) => c.hasCertificate).length;
        setStats({
          totalCourses: merged.length,
          inProgress,
          completed,
          certificates,
        });
      } catch (err) {
        // fallback: empty
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground text-lg">Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted text-foreground">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-5xl mx-auto px-4 md:px-8">
          {/* Modern Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-primary/10 to-background border-none shadow-lg">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-extrabold tracking-tight">
                {stats.totalCourses}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Courses
              </span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-blue-500/10 to-background border-none shadow-lg">
              <Progress value={stats.inProgress} className="h-2 w-full mb-1" />
              <span className="text-2xl font-extrabold tracking-tight">
                {stats.inProgress}
              </span>
              <span className="text-sm text-muted-foreground">In Progress</span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-green-500/10 to-background border-none shadow-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-extrabold tracking-tight">
                {stats.completed}
              </span>
              <span className="text-sm text-muted-foreground">Completed</span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-yellow-400/10 to-background border-none shadow-lg">
              <Award className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-extrabold tracking-tight">
                {stats.certificates}
              </span>
              <span className="text-sm text-muted-foreground">
                Certificates
              </span>
            </Card>
          </div>

          {/* Enrolled Courses - Modern Card Grid */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-8 text-foreground tracking-tight">
              Your Courses
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <Card
                    key={course.id}
                    className="flex flex-col border-none shadow-xl hover:scale-[1.02] transition-transform duration-200 bg-gradient-to-br from-card to-muted/60 group"
                  >
                    <div className="flex-1 p-6 flex flex-col gap-3">
                      <h3 className="font-bold text-xl text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        {course.instructor}
                      </p>
                      <div className="mb-2">
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                      </div>
                      {course.hasCertificate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => router.push(`/certificate/${course.id}`)}
                        >
                          View Certificate
                        </Button>
                      )}
                    </div>
                    <div className="p-4 border-t flex justify-end bg-background/80">
                      <Button
                        onClick={() => router.push(`/my-learning/${course.slug}`)}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {course.progress > 0
                          ? "Continue Learning"
                          : "Start Learning"}
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">
                    You have not enrolled in any courses yet.
                  </p>
                  <Button asChild className="mt-2 text-base px-6 py-3">
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
