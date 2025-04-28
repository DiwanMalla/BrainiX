"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast";

// Validation schema
const formSchema = z.object({
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  learningGoals: z
    .string()
    .max(500, "Learning goals must be 500 characters or less")
    .optional(),
  education: z.string().optional(),
  occupation: z.string().optional(),
});

interface FormData {
  interests: string[];
  learningGoals: string;
  education: string;
  occupation: string;
}

const educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor’s Degree",
  "Master’s Degree",
  "Doctorate",
  "Other",
];

const occupations = [
  "Student",
  "Software Engineer",
  "Designer",
  "Data Scientist",
  "Teacher",
  "Manager",
  "Freelancer",
  "Other",
];

const StudentProfileForm = ({ isSignup = false }: { isSignup?: boolean }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [characterCount, setCharacterCount] = useState(0);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      learningGoals: "",
      education: "",
      occupation: "",
    },
  });

  // Fetch categories and existing profile
  useEffect(() => {
    if (!isLoaded) return;

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive",
        });
      }
    };

    // Fetch existing profile
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = await axios.get("/api/student-profile");
        const profile = response.data;
        form.reset({
          interests: profile.interests || [],
          learningGoals: profile.learningGoals || "",
          education: profile.education || "",
          occupation: profile.occupation || "",
        });
        setCharacterCount(profile.learningGoals?.length || 0);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchCategories();
    if (!isSignup && user) fetchProfile();
  }, [isLoaded, user, form, isSignup, toast]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/student-profile", {
        interests: data.interests,
        learningGoals: data.learningGoals || null,
        education: data.education || null,
        occupation: data.occupation || null,
      });
      toast({
        title: "Success",
        description: "Your profile has been saved.",
      });
      router.push(isSignup ? "/dashboard" : "/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      form.setError("root", {
        message: "Failed to save profile. Please try again.",
      });
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle learning goals character count
  const handleLearningGoalsChange = (value: string) => {
    setCharacterCount(value.length);
    form.setValue("learningGoals", value);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm border border-gray-100 animate-in fade-in duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Complete Your Student Profile
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell us about yourself to personalize your learning experience
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={category}
                            checked={field.value.includes(category)}
                            onCheckedChange={(checked) => {
                              const newInterests = checked
                                ? [...field.value, category]
                                : field.value.filter(
                                    (item) => item !== category
                                  );
                              field.onChange(newInterests);
                            }}
                          />
                          <label
                            htmlFor={category}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    Select topics you're interested in
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learningGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you hope to achieve through your learning journey?"
                      className="min-h-[120px] resize-y"
                      maxLength={500}
                      {...field}
                      onChange={(e) =>
                        handleLearningGoalsChange(e.target.value)
                      }
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Describe your learning objectives</p>
                    <p>{characterCount}/500</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem key={occupation} value={occupation}>
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>

            {isSignup && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium"
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentProfileForm;
