import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - BrainiX",
  description:
    "Learn about BrainiX, an AI-powered e-learning platform built by students to make education accessible, intelligent, and interactive.",
  openGraph: {
    title: "About Us - BrainiX",
    description:
      "Discover BrainiX's mission to revolutionize education with AI-driven tools and student-led innovation.",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About BrainiX
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Empowering the future of education through AI innovation and
            student-driven passion.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
              At BrainiX, we believe education should be accessible, engaging,
              and tailored to every learner. Founded by a team of visionary
              students, our mission is to harness cutting-edge AI technology to
              create an e-learning platform that empowers students, educators,
              and lifelong learners worldwide. We’re breaking barriers to
              education by making learning intelligent, interactive, and
              inclusive—because knowledge should know no bounds.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-8">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
                Smart Course Recommendations
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Our AI analyzes your interests and learning patterns to
                recommend courses that match your goals, ensuring a personalized
                learning journey.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
                AI-Generated Quizzes
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Dynamic, adaptive quizzes generated by AI to test your knowledge
                and reinforce learning in real-time.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
                Real-Time Discussion Forums
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Connect with peers and instructors instantly through vibrant,
                AI-moderated forums that foster collaboration and ideas.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
                Video Learning
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Engaging, high-quality video content designed to make complex
                topics accessible and interactive.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3">
                Personalized Dashboards
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Track your progress, set goals, and manage your learning with
                intuitive dashboards tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-6">
              Built by Students, for the World
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
              BrainiX was born from the ambition of students who saw the
              potential of AI to transform education. As a student-led startup,
              we combine youthful creativity with technical expertise to build a
              platform that resonates with learners of all ages. Our team is
              driven by a shared purpose: to make education not just a process,
              but an inspiring journey. With every feature we develop, we’re
              pushing the boundaries of what’s possible in e-learning, fueled by
              innovation and a commitment to impact.
            </p>
            <div className="mt-8 text-center">
              <a
                href="/join-us"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Join Our Mission
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} BrainiX. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-4 sm:gap-6">
            <a
              href="/contact"
              className="text-gray-300 hover:text-white text-sm sm:text-base"
            >
              Contact
            </a>
            <a
              href="/privacy"
              className="text-gray-300 hover:text-white text-sm sm:text-base"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-gray-300 hover:text-white text-sm sm:text-base"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
