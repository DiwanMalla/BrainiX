"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Award } from "lucide-react";
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
    // Fetch dashboard stats and courses only (notifications removed)
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const coursesRes = await fetch("/api/courses/purchased");
        const coursesData = await coursesRes.json();
        const progressRes = await fetch("/api/courses/progress");
        const progressData = await progressRes.json();
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-foreground">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-8 max-w-6xl">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-[#232526]/80 to-[#2c5364]/80 border-none shadow-xl hover:scale-105 transition-transform">
              <BookOpen className="h-8 w-8 text-cyan-400 mb-2" />
              <span className="text-3xl font-extrabold tracking-tight text-cyan-200 drop-shadow-lg">
                {stats.totalCourses}
              </span>
              <span className="text-sm text-cyan-100/80 font-medium">
                Total Courses
              </span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-[#232526]/80 to-[#2c5364]/80 border-none shadow-xl hover:scale-105 transition-transform">
              <Progress
                value={stats.inProgress}
                className="h-2 w-full mb-2 bg-cyan-900"
              />
              <span className="text-3xl font-extrabold tracking-tight text-cyan-200 drop-shadow-lg">
                {stats.inProgress}
              </span>
              <span className="text-sm text-cyan-100/80 font-medium">
                In Progress
              </span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-[#232526]/80 to-[#2c5364]/80 border-none shadow-xl hover:scale-105 transition-transform">
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-3xl font-extrabold tracking-tight text-green-200 drop-shadow-lg">
                {stats.completed}
              </span>
              <span className="text-sm text-green-100/80 font-medium">
                Completed
              </span>
            </Card>
            <Card className="flex flex-col items-center gap-3 py-8 bg-gradient-to-b from-[#232526]/80 to-[#2c5364]/80 border-none shadow-xl hover:scale-105 transition-transform">
              <Award className="h-8 w-8 text-yellow-300 mb-2" />
              <span className="text-3xl font-extrabold tracking-tight text-yellow-100 drop-shadow-lg">
                {stats.certificates}
              </span>
              <span className="text-sm text-yellow-100/80 font-medium">
                Certificates
              </span>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-8 text-cyan-100 tracking-tight drop-shadow-lg">
              Enrolled Courses
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <Card
                    key={course.id}
                    className="flex flex-col border-none bg-gradient-to-br from-[#232526]/90 to-[#2c5364]/90 shadow-2xl hover:scale-[1.03] hover:shadow-cyan-700/30 transition-transform group overflow-hidden"
                  >
                    <div className="flex-1 p-6 flex flex-col gap-3">
                      <h3 className="font-bold text-xl text-cyan-100 mb-1 truncate group-hover:text-cyan-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-cyan-200/70 mb-2 font-medium">
                        {course.instructor}
                      </p>
                      <div className="mb-2">
                        <Progress
                          value={course.progress}
                          className="h-2 bg-cyan-900"
                        />
                        <div className="flex justify-between text-xs mt-1 text-cyan-100/80">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                      </div>
                      {course.hasCertificate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-cyan-400 text-cyan-200 hover:bg-cyan-900/30"
                          onClick={() =>
                            router.push(`/certificate/${course.id}`)
                          }
                        >
                          View Certificate
                        </Button>
                      )}
                    </div>
                    <div className="p-4 border-t-0 flex justify-end bg-cyan-900/20">
                      <Button
                        onClick={() =>
                          router.push(`/my-learning/${course.slug}`)
                        }
                        variant="secondary"
                        className="bg-cyan-700/80 text-cyan-100 hover:bg-cyan-600/90"
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
                  <p className="text-cyan-200/80 text-lg font-medium">
                    You have not enrolled in any courses yet.
                  </p>
                  <Button
                    asChild
                    className="mt-6 bg-cyan-700/80 text-cyan-100 hover:bg-cyan-600/90"
                  >
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
