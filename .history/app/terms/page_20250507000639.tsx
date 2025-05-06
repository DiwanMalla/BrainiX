"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chat/chat-icon";

export default function TermsOfServicePage() {
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
                Terms of Service
              </h1>
              <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Please read these Terms of Service carefully before using our
                platform.
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Service Content Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
                BrainiX Terms of Service
              </h2>
              <div className="space-y-8 text-sm sm:text-base text-muted-foreground">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    1. Acceptance of Terms
                  </h3>
                  <p>
                    By accessing or using the BrainiX platform, you agree to be
                    bound by these Terms of Service ("Terms"). If you do not
                    agree to these Terms, please do not use our services.
                    BrainiX reserves the right to update these Terms at any
                    time, and your continued use constitutes acceptance of any
                    changes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    2. Use of the Platform
                  </h3>
                  <p>
                    You agree to use the BrainiX platform only for lawful
                    purposes and in accordance with these Terms. You are
                    responsible for:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Maintaining the confidentiality of your account
                      credentials.
                    </li>
                    <li>
                      Ensuring all information you provide is accurate and
                      up-to-date.
                    </li>
                    <li>
                      Not engaging in any activity that disrupts or interferes
                      with the platform, including hacking, spamming, or
                      distributing malware.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    3. Intellectual Property
                  </h3>
                  <p>
                    All content on the BrainiX platform, including text,
                    graphics, logos, and course materials, is the property of
                    BrainiX or its licensors and is protected by intellectual
                    property laws. You may not reproduce, distribute, or create
                    derivative works from this content without express written
                    permission.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    4. User Content
                  </h3>
                  <p>
                    By submitting content to the platform (e.g., reviews,
                    comments, or course materials as an instructor), you grant
                    BrainiX a non-exclusive, worldwide, royalty-free license to
                    use, reproduce, and distribute that content in connection
                    with our services. You represent that you have the right to
                    grant this license and that your content does not infringe
                    on any third-party rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    5. Payments and Refunds
                  </h3>
                  <p>
                    Payments for courses or services are processed through our
                    designated payment processors. Refunds are subject to our
                    Refund Policy, available on the platform. BrainiX is not
                    responsible for any payment disputes arising from
                    third-party payment providers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    6. Limitation of Liability
                  </h3>
                  <p>
                    To the fullest extent permitted by law, BrainiX and its
                    affiliates shall not be liable for any indirect, incidental,
                    special, or consequential damages arising from your use of
                    the platform. Our total liability for any claim shall not
                    exceed the amount you paid for the specific service giving
                    rise to the claim.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    7. Termination
                  </h3>
                  <p>
                    BrainiX reserves the right to suspend or terminate your
                    access to the platform at any time, with or without notice,
                    for any violation of these Terms or for any other reason
                    deemed necessary to protect the platform or its users.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    8. Governing Law
                  </h3>
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with the laws of the State of [Insert State], without regard
                    to its conflict of law principles. Any disputes arising
                    under these Terms shall be resolved in the state or federal
                    courts located in [Insert City, State].
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    9. Contact Us
                  </h3>
                  <p>
                    If you have any questions about these Terms, please contact
                    us at:
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
      <Footer />
      <Chatbot />
    </div>
  );
}
