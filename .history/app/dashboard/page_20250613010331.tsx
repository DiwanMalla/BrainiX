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
        <div className="container px-4 md:px-6 max-w-6xl">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 flex flex-col items-center">
              <BookOpen className="h-6 w-6 mb-2 text-primary" />
              <span className="text-lg font-bold">{stats.totalCourses}</span>
              <span className="text-xs text-muted-foreground">Total Courses</span>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <Progress value={stats.inProgress} className="h-2 w-full mb-2" />
              <span className="text-lg font-bold">{stats.inProgress}</span>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
              <span className="text-lg font-bold">{stats.completed}</span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </Card>
            <Card className="p-4 flex flex-col items-center">
              <Award className="h-6 w-6 mb-2 text-yellow-500" />
              <span className="text-lg font-bold">{stats.certificates}</span>
              <span className="text-xs text-muted-foreground">Certificates</span>
            </Card>
          </div>

          {/* Notifications */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              <span className="font-semibold">Notifications</span>
            </div>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li key={notif.id} className={`p-3 rounded bg-muted ${notif.read ? '' : 'border-l-4 border-primary'}`}>
                    <span className="text-sm">{notif.message}</span>
                    <span className="block text-xs text-muted-foreground mt-1">{new Date(notif.date).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No notifications.</p>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col">
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
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
                  <div className="p-4 border-t flex justify-end">
                    <Button onClick={() => router.push(`/my-learning/${course.slug}`)}>
                      {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
