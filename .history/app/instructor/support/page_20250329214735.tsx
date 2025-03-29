"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Mail, Book, Users, MessageSquare } from "lucide-react";

export default function InstructorSupportPage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  // Contact form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "How do I publish a course?",
      answer:
        "To publish a course, go to 'My Courses', create a new course, fill in the details, and click 'Publish'. Ensure all required fields are completed.",
    },
    {
      question: "How do I view my course analytics?",
      answer:
        "Navigate to the 'Analytics' section in your dashboard to see enrollment trends, revenue, and student engagement metrics.",
    },
    {
      question: "How can I contact a student?",
      answer:
        "Use the 'Messages' tab to send direct messages to students enrolled in your courses.",
    },
    {
      question: "What do I do if my payment isn’t processing?",
      answer:
        "Check your payment settings in the 'Settings' page. If issues persist, contact support with transaction details.",
    },
  ];

  const quickLinks = [
    {
      title: "Documentation",
      href: "https://docs.brainix.com/instructors",
      icon: <Book className="h-6 w-6 text-primary" />,
      description: "Read our detailed instructor guides.",
    },
    {
      title: "Community Forum",
      href: "https://forum.brainix.com",
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Join discussions with other instructors.",
    },
    {
      title: "Email Support",
      href: "mailto:support@brainix.com",
      icon: <Mail className="h-6 w-6 text-primary" />,
      description: "Send us an email for assistance.",
    },
    {
      title: "Live Chat",
      href: "#", // Placeholder; replace with actual chat integration
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      description: "Chat with us (coming soon).",
    },
  ];

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.fullName || "Instructor",
          email: user?.primaryEmailAddress?.emailAddress || "",
          subject,
          message,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit request");
      toast({ title: "Support request submitted successfully!" });
      setSubject("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers or get in touch with us
        </p>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your subject"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question"
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  {link.icon}
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
