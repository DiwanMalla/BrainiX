"use client";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  thumbnail?: string;
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
  const router = useRouter();

  const sendMessage = async (): Promise<void> => {
    if (!message.trim() || !userId) return;

    const newMessage: ChatMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post<{ reply: string; courses: Course[] }>(
        "/api/chat",
        { message, courseId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
        }
      );

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.data.reply,
          courses: response.data.courses,
        },
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

  const handleCourseClick = (slug: string) => {
    router.push(`/courses/${slug}`);
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
      router.push("/sign-in");
    }
  }, [userId, isLoaded, isOpen, router]);

  // Sort courses
  const sortCourses = (courses: Course[]) => {
    return [...courses].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") return a.duration - b.duration;
      return b.rating - a.rating;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open chatbot"
        >
          <svg
            className="w-7 h-7"
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
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl flex flex-col h-[85vh] transition-all duration-300">
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
            <h2 className="text-xl font-bold">BrainiX AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded-full transition-colors"
              aria-label="Close chatbot"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4 flex flex-wrap gap-2 bg-gray-100">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin space-y-4"
            style={{ maxHeight: "calc(85vh - 220px)" }}
          >
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-600 py-4">
                Ask about courses, BrainiX features, or your learning progress!
              </div>
            )}
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`flex ${
                    chat.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      chat.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
                {chat.courses && chat.courses.length > 0 && (
                  <div className="space-y-3">
                    {sortCourses(
                      chat.courses.filter((course) =>
                        categoryFilter
                          ? course.category === categoryFilter
                          : true
                      )
                    ).map((course) => (
                      <div
                        key={course.slug}
                        onClick={() => handleCourseClick(course.slug)}
                        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={
                              course.thumbnail ||
                              "https://via.placeholder.com/150"
                            }
                            alt={`${course.title} thumbnail`}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Instructor: {course.instructor}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: ${course.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Duration: {course.duration} hours
                            </p>
                            <p className="text-sm text-gray-600">
                              Rating: {course.rating.toFixed(1)}/5
                            </p>
                            <p className="text-sm text-gray-600">
                              Enrollments: {course.enrollmentCount}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                toggleFavorite(course.slug);
                              }}
                              className={`mt-2 p-1 rounded ${
                                favorites.includes(course.slug)
                                  ? "text-red-500"
                                  : "text-gray-500"
                              } hover:text-red-600 transition-colors`}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                  <span className="animate-pulse text-gray-600">Typing...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-gray-50"
                placeholder={
                  isLoaded && !userId
                    ? "Sign in to chat"
                    : "Ask about courses..."
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && !isLoading && sendMessage()
                }
                disabled={isLoading || !userId}
              />
              <button
                type="button"
                onClick={sendMessage}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading || !userId}
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
