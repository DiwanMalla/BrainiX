import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 py-12 space-y-8 bg-background">
        <h1 className="text-4xl font-bold text-primary mb-4">Cookie Policy</h1>
        <section className="space-y-4">
          <p>
            This Cookie Policy explains how BrainiX (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) uses cookies and similar
            technologies when you visit our website.
          </p>
          <h2 className="text-2xl font-semibold mt-6">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your browser.
            They help us remember your preferences, understand how you use our
            site, and improve your experience.
          </p>
          <h2 className="text-2xl font-semibold mt-6">How We Use Cookies</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>To keep you signed in and maintain your session</li>
            <li>To remember your preferences and settings</li>
            <li>To analyze site traffic and usage for improvement</li>
            <li>To provide personalized content and recommendations</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6">
            Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                Essential Cookies:
              </span>{" "}
              Required for basic site functionality.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Analytics Cookies:
              </span>{" "}
              Help us understand how visitors interact with our site.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Preference Cookies:
              </span>{" "}
              Remember your choices and settings.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Marketing Cookies:
              </span>{" "}
              Used to deliver relevant ads and measure their effectiveness.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6">Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings.
            Please note that disabling cookies may affect your experience on our
            site.
          </p>
          <h2 className="text-2xl font-semibold mt-6">
            Changes to This Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will
            be posted on this page.
          </p>
          <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us
            at{" "}
            <a
              href="mailto:privacy@brainix.com"
              className="text-primary underline"
            >
              privacy@brainix.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
