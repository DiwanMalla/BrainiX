"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  DollarSign,
  Users,
  Star,
  Mail,
  Globe,
  MapPin,
  Calendar,
} from "lucide-react";
import { InstructorSidebar } from "@/components/instructor/sidebar";

export default function InstructorDetails() {
  const [instructor, setInstructor] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        // Fetch instructor profile
        const profileResponse = await fetch("/api/instructor/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();

        // Fetch instructor stats
        const statsResponse = await fetch("/api/instructor/stats", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!statsResponse.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsResponse.json();

        setInstructor(profileData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error || "Instructor not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage
                src={instructor.user.avatar || "/placeholder.svg"}
                alt={instructor.user.name}
              />
              <AvatarFallback>{instructor.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{instructor.user.name}</h1>
              <p className="text-lg mt-1 opacity-80">
                {instructor.title || "Professional Instructor"}
              </p>
              <div className="flex gap-2 mt-3 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-white text-blue-600">
                  {instructor.expertise || "Expert"}
                </Badge>
                <Badge variant="secondary" className="bg-white text-blue-600">
                  {instructor.courses?.length || 0} Courses
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stats?.totalStudents.toLocaleString() || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Courses
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stats?.totalCourses || 0}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      ${stats?.totalRevenue.toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <p>{instructor.user.email}</p>
              </div>
              {instructor.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <a
                    href={instructor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {instructor.website}
                  </a>
                </div>
              )}
              {instructor.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p>{instructor.location}</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p>
                  Joined {new Date(instructor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          {instructor.bio && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {instructor.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
            <Button variant="outline">View Courses</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
