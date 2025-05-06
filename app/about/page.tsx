import { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/chat/chat-icon";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us - BrainiX",
  description:
    "Discover BrainiX, an AI-powered e-learning platform built by students to make education accessible, intelligent, and interactive.",
  openGraph: {
    title: "About Us - BrainiX",
    description:
      "Learn about BrainiX's mission to revolutionize education with AI-driven tools and student-led innovation.",
    url: "https://brainix.com/about",
    siteName: "BrainiX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BrainiX About Us",
      },
    ],
  },
};

export default function AboutPage() {
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
                About BrainiX
              </h1>
              <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                Empowering the future of education with AI-driven innovation and
                student-led passion.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
                At BrainiX, we’re on a mission to make education accessible,
                intelligent, and interactive for learners worldwide. Founded by
                a team of ambitious students, we leverage cutting-edge AI to
                create an e-learning platform that adapts to individual needs,
                fosters collaboration, and inspires lifelong learning. We
                believe knowledge should be a universal right, and we’re
                building the tools to make that vision a reality.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-8">
              What Makes BrainiX Unique
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Smart Course Recommendations",
                  description:
                    "Our AI tailors course suggestions to your interests and goals, creating a personalized learning path.",
                },
                {
                  title: "AI-Generated Quizzes",
                  description:
                    "Dynamic quizzes adapt to your progress, reinforcing knowledge with real-time feedback.",
                },
                {
                  title: "Real-Time Discussion Forums",
                  description:
                    "Engage with peers and instructors in AI-moderated forums designed for collaboration and ideas.",
                },
                {
                  title: "Video Learning",
                  description:
                    "High-quality, interactive video content makes complex topics engaging and accessible.",
                },
                {
                  title: "Personalized Dashboards",
                  description:
                    "Track progress and manage your learning with intuitive, user-centric dashboards.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-background/90 p-6 rounded-lg border border-primary/10 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg sm:text-xl font-medium text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="bg-background/90 p-6 sm:p-8 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-6">
                Built by Students, for the World
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
                BrainiX was born from the vision of students who saw AI’s
                potential to transform education. As a student-led startup, we
                blend youthful creativity with technical expertise to build a
                platform that resonates with learners everywhere. Our team is
                united by a shared purpose: to make education an inspiring,
                accessible journey for all. With every feature we develop, we’re
                redefining what e-learning can be.
              </p>
              <div className="mt-8 text-center">
                <Button
                  asChild
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <a href="/auth?tab=signup">Join Our Mission</a>
                </Button>
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
