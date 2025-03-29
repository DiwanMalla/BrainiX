"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define validation schema
const settingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  avatarUrl: z.string().url("Invalid URL").or(z.string().length(0)),
  defaultPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Price must be a positive number",
    }),
  defaultDiscount: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      {
        message: "Discount must be between 0 and 100",
      }
    ),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function InstructorSettingsPage() {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      avatarUrl: user?.imageUrl || "",
      defaultPrice: "99.99",
      defaultDiscount: "0",
    },
  });

  const [notifyEnrollments, setNotifyEnrollments] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyPerformance, setNotifyPerformance] = useState(false);
  const [defaultVisibility, setDefaultVisibility] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === "dark");

  useEffect(() => {
    if (!user) return;
    reset({
      fullName: user.fullName || "",
      avatarUrl: user.imageUrl || "",
      defaultPrice: "99.99",
      defaultDiscount: "0",
    });
    setDarkMode(theme === "dark");
  }, [user, theme, reset]);

  const handleSaveProfile = async (data: SettingsForm) => {
    if (!user) return;
    try {
      // Update name
      await user.update({
        firstName: data.fullName.split(" ")[0],
        lastName: data.fullName.split(" ").slice(1).join(" ") || "",
      });

      // Update avatar if changed
      if (data.avatarUrl && data.avatarUrl !== user.imageUrl) {
        // Fetch the image from the URL
        const response = await fetch(data.avatarUrl);
        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();

        // Convert to File (Clerk expects a File object)
        const file = new File([blob], "avatar.jpg", { type: blob.type });

        // Set the profile image
        await user.setProfileImage({ file });
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

  const handleSavePreferences = async () => {
    const preferences = {
      notifyEnrollments,
      notifyMessages,
      notifyPerformance,
      defaultVisibility,
    };
    toast({ title: "Preferences saved (local only)" });
  };

  const handleSaveDefaults = async (data: SettingsForm) => {
    const defaults = {
      defaultPrice: Number(data.defaultPrice),
      defaultVisibility,
      defaultDiscount: Number(data.defaultDiscount),
    };
    toast({ title: "Course defaults saved (local only)" });
  };

  const handleSaveAppearance = () => {
    setTheme(darkMode ? "dark" : "light");
    toast({ title: "Theme saved!" });
  };

  if (!isLoaded || !user) return <div>Loading...</div>;

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
            <form
              onSubmit={handleSubmit(handleSaveProfile)}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName ?? undefined}
                  />
                  <AvatarFallback>
                    {user.fullName?.charAt(0) || "I"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    {...register("avatarUrl")}
                    placeholder="Enter image URL"
                  />
                  {errors.avatarUrl && (
                    <p className="text-sm text-destructive">
                      {errors.avatarUrl.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.primaryEmailAddress?.emailAddress || ""}
                  disabled
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
              <Button type="submit">Save Profile</Button>
            </form>
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
            <form
              onSubmit={handleSubmit(handleSaveDefaults)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="defaultPrice">Default Course Price ($)</Label>
                <Input
                  id="defaultPrice"
                  type="number"
                  step="0.01"
                  {...register("defaultPrice")}
                />
                {errors.defaultPrice && (
                  <p className="text-sm text-destructive">
                    {errors.defaultPrice.message}
                  </p>
                )}
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
                  step="1"
                  {...register("defaultDiscount")}
                />
                {errors.defaultDiscount && (
                  <p className="text-sm text-destructive">
                    {errors.defaultDiscount.message}
                  </p>
                )}
              </div>
              <Button type="submit">Save Defaults</Button>
            </form>
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
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  setTheme(checked ? "dark" : "light");
                }}
              />
            </div>
            <Button onClick={handleSaveAppearance}>Save Appearance</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
