import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  rating: number | null | undefined; // Updated type to allow null or undefined
  students: number | null | undefined; // Updated type to allow null or undefined
  price: number;
  image: string;
  discount?: number;
  bestseller?: boolean;
  category: string;
  level: string;
  shortDescription?: string;
}

export default function CourseCard({
  slug,
  title,
  instructor,
  rating,
  students,
  price,
  image,
  discount,
  bestseller = false,
  category,
  level,
  shortDescription,
}: CourseCardProps) {
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  // Fallback for undefined or null values
  const validRating = rating != null ? rating : 0; // Default to 0 if rating is undefined or null
  const validStudents = students != null ? students : 0; // Default to 0 if students is undefined or null

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/courses/${slug}`}>
        <div className="relative h-48">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out hover:scale-105"
          />
          {bestseller && (
            <Badge className="absolute left-2 top-2" variant="default">
              Bestseller
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader className="p-4">
        <Link href={`/courses/${slug}`}>
          <h3 className="font-bold hover:text-primary line-clamp-2">{title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{instructor}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-1">
          <span className="font-medium text-amber-500">
            {validRating.toFixed(1)} {/* Safely using toFixed() */}
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(validRating)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({validStudents.toLocaleString()}){" "}
            {/* Safely using toLocaleString() */}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="secondary">{level}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="font-bold">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-bold">${price.toFixed(2)}</span>
          )}
        </div>
        {discount && (
          <Badge variant="outline" className="text-xs">
            Save {discount}%
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
