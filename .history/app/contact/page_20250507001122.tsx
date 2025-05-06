"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chat/chat-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-blue-50 to-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-100 rounded-full filter blur-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-2xl animate-pulse delay-1000" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                Contact BrainiX
              </h1>
              <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                We&apos;re here to answer your questions and explore partnership
                opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 bg-background/90 border-primary/10"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 bg-background/90 border-primary/10"
                      placeholder="Your email"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, subject: value }))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1 bg-background/90 border-primary/10">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 bg-background/90 border-primary/10"
                      placeholder="Your message"
                      rows={5}
                      disabled={isSubmitting}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  {submitStatus === "success" && (
                    <p className="text-sm text-green-600 text-center">
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-sm text-destructive text-center">
                      Failed to send message. Please try again later.
                    </p>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Email
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      <a
                        href="mailto:support@brainix.com"
                        className="hover:underline"
                      >
                        support@brainix.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Phone
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      <a href="tel:+1234567890" className="hover:underline">
                        +1 (234) 567-890
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Address
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      123 Innovation Drive, Tech City, TC 12345
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-primary/10 hover:bg-primary/5"
                  >
                    <a href="/join-us">Explore Partnership Opportunities</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
