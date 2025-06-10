import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 py-12 space-y-8 bg-background">
        <h1 className="text-4xl font-bold text-primary mb-4">Accessibility Statement</h1>
        <section className="space-y-4">
          <p>
            At BrainiX, we are committed to ensuring digital accessibility for all users, including people with disabilities. We strive to continually improve the user experience for everyone and apply relevant accessibility standards to our website and services.
          </p>
          <h2 className="text-2xl font-semibold mt-6">Our Commitment</h2>
          <p>
            We aim to make our website and content accessible by following the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Our efforts include:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Providing text alternatives for non-text content</li>
            <li>Ensuring sufficient color contrast and readable fonts</li>
            <li>Supporting keyboard navigation and screen readers</li>
            <li>Making forms and interactive elements accessible</li>
            <li>Regularly testing and updating our site for accessibility</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6">Feedback & Assistance</h2>
          <p>
            If you experience any difficulty accessing content or have suggestions for improvement, please contact us at{' '}
            <a href="mailto:accessibility@brainix.com" className="text-primary underline">accessibility@brainix.com</a>.
            We value your feedback and will do our best to address your concerns promptly.
          </p>
          <h2 className="text-2xl font-semibold mt-6">Ongoing Efforts</h2>
          <p>
            We are dedicated to ongoing accessibility improvements and regularly review our website to enhance usability for all users.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
