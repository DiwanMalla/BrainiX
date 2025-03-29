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
    <div className="flex min-h-screen bg-background p-8">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight text-primary">
          Help & Support
        </h1>
        <p className="text-muted-foreground text-lg">
          Find answers or get in touch with us
        </p>

        {/* FAQ Section */}
        <Card className="shadow-md bg-muted hover:bg-muted/80 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-medium">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-xl font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="shadow-md bg-muted hover:bg-muted/80 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-medium">
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitContact} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your subject"
                  disabled={isSubmitting}
                  className="bg-transparent border-muted/60 hover:border-primary focus:ring-2 focus:ring-primary"
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
                  className="bg-transparent border-muted/60 hover:border-primary focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-md bg-muted hover:bg-muted/80 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 border rounded-lg bg-muted hover:bg-muted/80 transition-colors shadow-md"
                >
                  {link.icon}
                  <div>
                    <p className="font-medium text-lg">{link.title}</p>
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
