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
  avatarUrl?: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: parseInt(testimonial.id) * 0.2 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    >
      <Card className="border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(testimonial.rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          {/* Testimonial Content */}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {testimonial.content}
          </p>
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage
                src={testimonial.avatarUrl || "/placeholder-avatar.png"}
                alt={testimonial.authorName}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {testimonial.authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {testimonial.authorName}
              </p>
              <p className="text-xs text-muted-foreground">
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
