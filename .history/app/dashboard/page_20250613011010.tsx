"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats, courses, and notifications
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
          const progressEntry = progressData.find((p: any) => p.courseId === course.id);
          return {
            ...course,
            progress: progressEntry ? progressEntry.progress : 0,
            hasCertificate: course.certificateAvailable && progressEntry && progressEntry.progress === 100,
          };
        });
        setCourses(merged);
        const completed = merged.filter((c: any) => c.progress === 100).length;
        const inProgress = merged.filter((c: any) => c.progress > 0 && c.progress < 100).length;
        const certificates = merged.filter((c: any) => c.hasCertificate).length;
        setStats({
          totalCourses: merged.length,
          inProgress,
          completed,
          certificates,
        });
        // Notifications (simulate)
        const notifRes = await fetch("/api/notifications");
        const notifData = notifRes.ok ? await notifRes.json() : [];
        setNotifications(notifData);
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-8 max-w-5xl">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card className="flex flex-col items-center gap-2 py-6 shadow-none border border-border bg-card">
              <BookOpen className="h-7 w-7 text-primary mb-1" />
              <span className="text-xl font-bold">{stats.totalCourses}</span>
              <span className="text-xs text-muted-foreground">Total Courses</span>
            </Card>
            <Card className="flex flex-col items-center gap-2 py-6 shadow-none border border-border bg-card">
              <Progress value={stats.inProgress} className="h-2 w-full mb-1" />
              <span className="text-xl font-bold">{stats.inProgress}</span>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </Card>
            <Card className="flex flex-col items-center gap-2 py-6 shadow-none border border-border bg-card">
              <CheckCircle className="h-7 w-7 text-green-500 mb-1" />
              <span className="text-xl font-bold">{stats.completed}</span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </Card>
            <Card className="flex flex-col items-center gap-2 py-6 shadow-none border border-border bg-card">
              <Award className="h-7 w-7 text-yellow-500 mb-1" />
              <span className="text-xl font-bold">{stats.certificates}</span>
              <span className="text-xs text-muted-foreground">Certificates</span>
            </Card>
          </div>

          {/* Notifications */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base">Notifications</span>
            </div>
            <div className="rounded-lg bg-muted/60 p-4 border border-border">
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notif) => (
                    <li key={notif.id} className={`flex flex-col gap-1 p-3 rounded bg-background/80 ${notif.read ? '' : 'border-l-4 border-primary'}`}>
                      <span className="text-sm text-foreground">{notif.message}</span>
                      <span className="text-xs text-muted-foreground">{new Date(notif.date).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No notifications.</p>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Enrolled Courses</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {courses.length > 0 ? courses.map((course) => (
                <Card key={course.id} className="flex flex-col border border-border bg-card shadow-none hover:shadow-lg transition-shadow duration-200">
                  <div className="flex-1 p-5 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg text-foreground mb-1 truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
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
                  <div className="p-4 border-t flex justify-end bg-muted/40">
                    <Button onClick={() => router.push(`/my-learning/${course.slug}`)} variant="secondary">
                      {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                  </div>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">You have not enrolled in any courses yet.</p>
                  <Button asChild className="mt-4">
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
