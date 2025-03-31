import { TestimonialCard } from "../TestimonialCard";
import { motion } from "framer-motion";

const hardcodedTestimonials = [
  {
    id: "1",
    content:
      "This course transformed my career! I landed a job as a developer within months.",
    authorName: "Jane Doe",
    authorTitle: "Software Engineer at TechCorp",
    rating: 4.8,
    course: { title: "Web Development Bootcamp" },
    avatarUrl: "https://i.pravatar.cc/150?img=1", // Placeholder avatar
  },
  {
    id: "2",
    content:
      "The instructors are amazing and the content is top-notch. Highly recommend!",
    authorName: "John Smith",
    authorTitle: "Freelance Designer",
    rating: 4.5,
    course: { title: "UI/UX Design Mastery" },
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    content:
      "I learned so much in such a short time. The hands-on projects were invaluable.",
    authorName: "Alice Johnson",
    rating: 5.0,
    course: { title: "Data Science Fundamentals" },
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Particle Effect Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              What Our Students Say
            </h2>
            <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed">
              Hear from our community of learners who have transformed their
              careers with BrainiX.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {hardcodedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
