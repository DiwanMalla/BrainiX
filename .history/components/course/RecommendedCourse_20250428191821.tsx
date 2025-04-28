import { useEffect, useState, useCallback } from "react";
import CourseCard from "../Card/CourseCard";
import { CartItem } from "@/lib/cart-context";

type RecommendedCourse = {
  id: string | number;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  discount?: number;
  thumbnail: string;
  instructor: string;
  rating: number;
  students: number; // Ensure students is included
  bestseller: boolean;
  category: string;
  level: string;
};

interface RecommendedCourseProps {
  excludeSlug?: string;
  cartItems?: CartItem[];
  userId?: string; // Add userId for personalized recommendations
  searchQuery?: string; // Add searchQuery for search-based recommendations
}

const RecommendedCourse = ({
  excludeSlug,
  cartItems = [],
  userId,
  searchQuery,
}: RecommendedCourseProps) => {
  const [recommendedCourses, setRecommendedCourses] = useState<
    RecommendedCourse[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendedCourses = useCallback(async () => {
    try {
      setLoading(true);
      // Construct URL with query parameters
      const params = new URLSearchParams();
      if (excludeSlug) params.append("excludeSlug", excludeSlug);
      if (userId) params.append("userId", userId);
      if (searchQuery) params.append("search", searchQuery);

      const url = `/api/courses/recommended?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch recommended courses");
      const data: RecommendedCourse[] = await res.json();

      // Filter out courses that are already in the cart
      const filteredCourses = data.filter(
        (course) => !cartItems.some((item) => item.id === course.id.toString())
      );
      setRecommendedCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
    } finally {
      setLoading(false);
    }
  }, [excludeSlug, cartItems, userId, searchQuery]);

  useEffect(() => {
    fetchRecommendedCourses();
  }, [fetchRecommendedCourses]);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="mb-6 text-2xl font-bold">Recommended Courses</h2>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-muted h-64 rounded-lg"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-2xl font-bold">Recommended Courses</h2>
      <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {recommendedCourses.length > 0 ? (
          recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id.toString()}
              slug={course.slug}
              title={course.title}
              instructor={course.instructor || "Unknown Instructor"}
              rating={course.rating}
              students={course.students} // Pass students to CourseCard
              price={course.price}
              image={course.thumbnail}
              discount={course.discount}
              bestseller={course.bestseller}
              category={course.category || "Uncategorized"}
              level={course.level}
              shortDescription={course.shortDescription}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No additional recommendations available.
          </p>
        )}
      </div>
    </section>
  );
};

export default RecommendedCourse;
