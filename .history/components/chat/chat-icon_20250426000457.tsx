"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

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
  slug: string;
  // Add image URL if available from your DB
  imageUrl?: string;
}

interface ChatbotProps {
  courseId?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ courseId }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { getToken } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/chat",
        { message, courseId },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const { reply, courses } = response.data;

      const aiMessage: ChatMessage = {
        sender: "ai",
        text: reply,
        courses,
      };

      setChatHistory((prev) => [...prev, aiMessage]);

      setTimeout(() => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      }, 100);
    } catch (error) {
      console.error("Chatbot error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div
        ref={containerRef}
        className="h-[400px] overflow-y-auto border rounded p-4 space-y-4 bg-gray-50"
      >
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`text-sm ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block px-3 py-2 rounded-md ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </p>

            {/* Render course cards only for AI replies */}
            {msg.sender === "ai" && (msg.courses ?? []).length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(msg.courses ?? []).map((course, idx) => (
                  <Link
                    key={idx}
                    href={`/courses/${course.slug}`}
                    className="group"
                  >
                    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-xl transition">
                      {course.imageUrl && (
                        <div className="w-full h-40 relative mb-2">
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold group-hover:text-blue-600 transition">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Price: ${course.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {course.duration} hrs
                      </p>
                      <p className="text-sm text-gray-600">
                        Rating: {course.rating ?? "N/A"}/5
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {course.category}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about a course..."
          className="flex-grow px-4 py-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
