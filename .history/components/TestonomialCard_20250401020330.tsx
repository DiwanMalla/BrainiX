import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  content: string;
  authorName: string;
  authorTitle?: string;
  rating: number;
  course: { title: string };
  avatarUrl?: string; // Optional avatar URL for the author
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: parseInt(testimonial.id) * 0.2 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      }}
      className="relative"
    >
      <Card className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-500/30 shadow-lg overflow-hidden">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
        <CardContent className="relative p-6 space-y-4 text-white">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(testimonial.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          {/* Testimonial Content */}
          <p className="text-gray-300 text-sm leading-relaxed">
            {testimonial.content}
          </p>
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-blue-500">
              <AvatarImage
                src={testimonial.avatarUrl || "/placeholder-avatar.png"}
                alt={testimonial.authorName}
              />
              <AvatarFallback className="bg-blue-600 text-white">
                {testimonial.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-blue-300">
                {testimonial.authorName}
              </p>
              <p className="text-xs text-gray-400">
                {testimonial.authorTitle || "Student"} |{" "}
                {testimonial.course.title}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
