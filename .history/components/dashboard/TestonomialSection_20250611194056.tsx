import { TestimonialCard } from "../TestonomialCard";
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
    avatarUrl: "https://i.pravatar.cc/150?img=1",
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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
              What Our Students Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
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
