// components/TestimonialCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  authorName: string;
  authorTitle?: string;
  rating?: number;
  course?: { title: string };
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-1">
          {testimonial.rating &&
            Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(testimonial.rating ?? 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
        </div>
        <p className="text-muted-foreground">{testimonial.content}</p>
        <div>
          <p className="font-semibold">{testimonial.authorName}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.authorTitle || "Student"}
            {testimonial.course && ` | ${testimonial.course.title}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
