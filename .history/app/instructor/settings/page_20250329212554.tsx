"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast"; // Optional: for feedback

export default function InstructorSettingsPage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast(); // Optional: for feedback
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl || "");

  // Notification preferences state
  const [notifyEnrollments, setNotifyEnrollments] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyPerformance, setNotifyPerformance] = useState(false);

  // Course defaults state
  const [defaultPrice, setDefaultPrice] = useState("99.99");
  const [defaultVisibility, setDefaultVisibility] = useState(true); // true = public
  const [defaultDiscount, setDefaultDiscount] = useState("0");

  // Appearance state
  const [darkMode, setDarkMode] = useState(false); // Could use next-themes

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await user.update({
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        // Email updates might require Clerk's email verification flow
      });
      if (avatarUrl !== user.imageUrl) {
        await user.update({ profileImageUrl: avatarUrl });
      }
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleSavePreferences = () => {
    // TODO: Save to backend (e.g., Prisma) or local storage
    toast({ title: "Preferences saved!" });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{fullName?.charAt(0) || "I"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled // Email updates typically require Clerk verification
              />
              <p className="text-xs text-muted-foreground">
                To change your email, use the{" "}
                <a
                  href="https://dashboard.clerk.dev"
                  className="text-primary underline"
                >
                  Clerk Dashboard
                </a>
                .
              </p>
            </div>
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyEnrollments">New Student Enrollments</Label>
              <Switch
                id="notifyEnrollments"
                checked={notifyEnrollments}
                onCheckedChange={setNotifyEnrollments}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyMessages">Student Messages</Label>
              <Switch
                id="notifyMessages"
                checked={notifyMessages}
                onCheckedChange={setNotifyMessages}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyPerformance">
                Course Performance Updates
              </Label>
              <Switch
                id="notifyPerformance"
                checked={notifyPerformance}
                onCheckedChange={setNotifyPerformance}
              />
            </div>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Course Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Course Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPrice">Default Course Price ($)</Label>
              <Input
                id="defaultPrice"
                type="number"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultVisibility">
                Default Visibility (Public)
              </Label>
              <Switch
                id="defaultVisibility"
                checked={defaultVisibility}
                onCheckedChange={setDefaultVisibility}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDiscount">Default Discount (%)</Label>
              <Input
                id="defaultDiscount"
                type="number"
                value={defaultDiscount}
                onChange={(e) => setDefaultDiscount(e.target.value)}
              />
            </div>
            <Button onClick={handleSavePreferences}>Save Defaults</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <Button onClick={() => toast({ title: "Theme saved!" })}>
              Save Appearance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
