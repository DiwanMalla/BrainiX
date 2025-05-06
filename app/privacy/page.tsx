"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chat/chat-icon";

// Define types for custom components
type NavbarProps = {};
type FooterProps = {};
type ChatbotProps = {};

const NavbarComponent: React.FC<NavbarProps> = Navbar as React.FC<NavbarProps>;
const FooterComponent: React.FC<FooterProps> = Footer as React.FC<FooterProps>;
const ChatbotComponent: React.FC<ChatbotProps> =
  Chatbot as React.FC<ChatbotProps>;

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavbarComponent />
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
                Privacy Policy
              </h1>
              <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Learn how BrainiX collects, uses, and protects your personal
                information.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                BrainiX Privacy Policy
              </h2>
              <div className="space-y-8 text-sm sm:text-base text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    1. Introduction
                  </h3>
                  <p>
                    At BrainiX, we are committed to protecting your privacy.
                    This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your personal information when you use our
                    platform, including our website, mobile applications, and
                    services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    2. Information We Collect
                  </h3>
                  <p>We may collect the following types of information:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Personal Information:</strong> Name, email
                      address, phone number, billing information, and other
                      details you provide when creating an account or making a
                      purchase.
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Information about how you
                      interact with our platform, such as pages visited, courses
                      enrolled, and time spent on the site.
                    </li>
                    <li>
                      <strong>Device Information:</strong> IP address, browser
                      type, operating system, and device identifiers.
                    </li>
                    <li>
                      <strong>Cookies and Tracking Technologies:</strong> Data
                      collected via cookies and similar technologies to enhance
                      your experience and analyze usage.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    3. How We Use Your Information
                  </h3>
                  <p>Your information is used to:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Provide and improve our services, such as delivering
                      courses and processing payments.
                    </li>
                    <li>
                      Personalize your experience, including recommending
                      relevant courses.
                    </li>
                    <li>
                      Communicate with you, including sending transactional
                      emails, updates, and promotional offers.
                    </li>
                    <li>
                      Analyze platform usage to enhance performance and user
                      experience.
                    </li>
                    <li>
                      Comply with legal obligations and protect against
                      fraudulent activities.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    4. Sharing Your Information
                  </h3>
                  <p>
                    We do not sell your personal information. We may share your
                    information with:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <strong>Service Providers:</strong> Third parties that
                      assist with payment processing, analytics, and email
                      delivery.
                    </li>
                    <li>
                      <strong>Instructors:</strong> Limited information (e.g.,
                      your name) may be shared with instructors for
                      course-related purposes.
                    </li>
                    <li>
                      <strong>Legal Authorities:</strong> When required by law
                      or to protect our rights and safety.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    5. Cookies and Tracking
                  </h3>
                  <p>
                    We use cookies and similar technologies to enhance your
                    experience, analyze usage, and deliver personalized content.
                    You can manage cookie preferences through your browser
                    settings or our cookie consent tool.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    6. Data Security
                  </h3>
                  <p>
                    We implement industry-standard security measures, such as
                    encryption and secure servers, to protect your information.
                    However, no system is completely secure, and we cannot
                    guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    7. Your Rights
                  </h3>
                  <p>
                    Depending on your jurisdiction, you may have the right to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Access, correct, or delete your personal information.
                    </li>
                    <li>Opt out of marketing communications.</li>
                    <li>Request data portability or restrict processing.</li>
                  </ul>
                  <p>
                    To exercise these rights, contact us using the information
                    below.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    8. Third-Party Links
                  </h3>
                  <p>
                    Our platform may contain links to third-party websites. We
                    are not responsible for the privacy practices or content of
                    these sites. Please review their privacy policies before
                    sharing information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    9. Changes to This Policy
                  </h3>
                  <p>
                    We may update this Privacy Policy from time to time. Changes
                    will be posted on this page, and significant updates may be
                    communicated via email or platform notifications.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    10. Contact Us
                  </h3>
                  <p>
                    If you have questions about this Privacy Policy or our data
                    practices, please contact us at:
                  </p>
                  <ul className="list-none pl-0 mt-2 space-y-1">
                    <li>
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:support@brainix.com"
                        className="hover:underline"
                      >
                        support@brainix.com
                      </a>
                    </li>
                    <li>
                      <strong>Phone:</strong>{" "}
                      <a href="tel:+1234567890" className="hover:underline">
                        +1 (234) 567-890
                      </a>
                    </li>
                    <li>
                      <strong>Address:</strong> 123 Innovation Drive, Tech City,
                      TC 12345
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
};

export default PrivacyPolicyPage;
