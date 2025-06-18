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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, AlertTriangle } from "lucide-react";

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
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-2">
                <HelpCircle className="inline-block h-8 w-8 text-primary" />{" "}
                Contact BrainiX
              </h1>
              <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                We&apos;re here to answer your questions and explore partnership
                opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 grid gap-12 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
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
                      <SelectItem value="support">Technical Support</SelectItem>
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
            {/* Contact Info & Troubleshooting */}
            <div className="space-y-8">
              <div className="bg-background/90 p-6 rounded-lg border border-primary/10 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href="mailto:support@brainix.com"
                      className="hover:underline text-primary"
                    >
                      support@brainix.com
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    <a
                      href="tel:+1234567890"
                      className="hover:underline text-primary"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> 123 Innovation
                    Drive, Tech City, TC 12345
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-6 border-primary/10 hover:bg-primary/5"
                >
                  <a href="/join-us">Explore Partnership Opportunities</a>
                </Button>
              </div>
              {/* Troubleshooting Guide */}
              <div className="bg-background/90 p-6 rounded-lg border border-yellow-400/20 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />{" "}
                  Troubleshooting Guide
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    If you don&apos;t receive a response within 48 hours, check
                    your spam folder.
                  </li>
                  <li>
                    For urgent technical issues, use the &quot;Technical
                    Support&quot; subject for priority handling.
                  </li>
                  <li>Clear your browser cache if the form does not submit.</li>
                  <li>
                    Still having trouble? Email us directly at{" "}
                    <a
                      href="mailto:support@brainix.com"
                      className="underline text-primary"
                    >
                      support@brainix.com
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-16 bg-muted/50 dark:bg-muted/30 border-t">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="multiple"
              className="rounded-lg bg-background/80 border border-primary/10 shadow-md"
            >
              <AccordionItem value="faq-1">
                <AccordionTrigger>
                  How long does it take to get a response?
                </AccordionTrigger>
                <AccordionContent>
                  We aim to respond to all inquiries within 24-48 business
                  hours. For urgent issues, select &quot;Technical Support&quot;
                  in the form.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Can I partner with BrainiX?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! Use the &quot;Partnership&quot; subject or the
                  &quot;Explore Partnership Opportunities&quot; button to get in
                  touch with our team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>
                  How do I report a bug or technical issue?
                </AccordionTrigger>
                <AccordionContent>
                  Select &quot;Technical Support&quot; as the subject and
                  provide as much detail as possible. Screenshots are helpful!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger>
                  Is my data safe when I contact you?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, your data is handled securely and only used to address
                  your inquiry. Read our privacy policy for more details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger>
                  Can I get support in languages other than English?
                </AccordionTrigger>
                <AccordionContent>
                  Currently, we primarily support English, but we&apos;ll do our
                  best to assist you in your preferred language.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
