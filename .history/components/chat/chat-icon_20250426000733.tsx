"use client";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  courses?: Course[];
}

interface Course {
  title: string;
  price: number;
  duration: number;
  rating: number;
  category: string;
  instructor: string;
  enrollmentCount: number;
  slug: string;
  thumbnail?: string; // Added for thumbnail image
}

interface ChatbotProps {
  courseId?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ courseId }) => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "duration">(
    "rating"
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { userId, isLoaded } = useAuth();

  const sendMessage = async (): Promise<void> => {
    if (!message.trim() || !userId) return;

    const newMessage: ChatMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post<{ reply: string }>(
        "/api/chat",
        { message, courseId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      // Parse courses from response
      let courses: Course[] = [];
      if (response.data.reply.includes("**")) {
        const courseMatches = response.data.reply.match(
          /- \*\*(.*?)\*\*([\s\S]*?)(?=- \*\*|$)/g
        );
        if (courseMatches) {
          courses = courseMatches.map((match) => {
            const title = match.match(/\*\*(.*?)\*\*/)?.[1] || "";
            const price = parseFloat(
              match.match(/Price: \$([\d.]+)/)?.[1] || "0"
            );
            const duration = parseFloat(
              match.match(/Duration: ([\d.]+) hours/)?.[1] || "0"
            );
            const rating = parseFloat__(
              match.match(/Rating: ([\d.]+)\/5/)?.[1] || "0"
            );
            const category = match.match(/Category: (.*?)\n/)?.[1] || "";
            const instructor = match.match(/Instructor: (.*?)\n/)?.[1] || "";
            const enrollmentCount = parseInt(
              match.match(/Enrollments: (\d+)/)?.[1] || "0"
            );
            const slug = match.match(/Enroll: \/courses\/(.*?)$/m)?.[1] || "";
            // Placeholder thumbnail (replace with actual URL if available)
            const thumbnail = "https://via.placeholder.com/150";
            return {
              title,
              price,
              duration,
              rating,
              category,
              instructor,
              enrollmentCount,
              slug,
              thumbnail,
            };
          });
        }
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply, courses },
      ]);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error:", axiosError.response?.data || axiosError.message);
      const errorMessage =
        axiosError.response?.status === 429
          ? "Rate limit exceeded. Try again later."
          : axiosError.response?.status === 403
          ? "Authentication error. Please contact support."
          : axiosError.response?.status === 401
          ? "Please sign in to continue."
          : "Error: Try again later.";
      setChatHistory((prev) => [...prev, { sender: "ai", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !userId && isOpen) {
      window.location.href = "/sign-in";
    }
  }, [userId, isLoaded, isOpen]);

  // Sort courses
  const sortCourses = (courses: Course[]) => {
    return [...courses].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration - b.duration;
      return b.rating - a.rating; // Default: rating
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          aria-label="Open chatbot"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
      {isOpen && (
        <div className="w-80 md:w-96 bg-white shadow-2xl rounded-lg flex flex-col max-h-[80vh] transition-all duration-300">
          <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
            <h2 className="text-lg font-semibold">BrainiX Smart Helper</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
              aria-label="Close chatbot"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 flex space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "rating" | "price" | "duration")
              }
              className="w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin"
            style={{ maxHeight: "calc(80vh - 200px)" }}
          >
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500">
                Ask about courses, BrainiX features, or your learning progress!
              </div>
            )}
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    chat.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {chat.text}
                  {chat.courses && chat.courses.length > 0 && (
                    <div className="mt-2 space-y-3">
                      {sortCourses(
                        chat.courses.filter((course) =>
                          categoryFilter
                            ? course.category === categoryFilter
                            : true
                        )
                      ).map((course) => (
                        <Link
                          href={`/courses/${course.slug}`}
                          key={course.slug}
                          className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={
                                course.thumbnail ||
                                "https://via.placeholder.com/150"
                              }
                              alt={`${course.title} thumbnail`}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-800">
                                {course.title}
                              </h3>
                              <p className="text-gray-600">
                                Price: ${course.price.toFixed(2)}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent Link navigation
                                  toggleFavorite(course.slug);
                                }}
                                className={`mt-2 p-1 rounded ${
                                  favorites.includes(course.slug)
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                                aria-label={
                                  favorites.includes(course.slug)
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill={
                                    favorites.includes(course.slug)
                                      ? "currentColor"
                                      : "none"
                                  }
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t">
            <input
              type="text"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder={
                isLoaded && !userId ? "Sign in to chat" : "Ask about courses..."
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && !isLoading && sendMessage()
              }
              disabled={isLoading || !userId}
            />
            <button
              type="button"
              onClick={sendMessage}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
              disabled={isLoading || !userId}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
