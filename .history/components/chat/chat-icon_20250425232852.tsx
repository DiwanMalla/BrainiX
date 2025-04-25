"use client";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

interface ChatbotProps {
  courseId?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ courseId }) => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply },
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
            <h2 className="text-lg font-semibold">BrainiX Chatbot</h2>
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
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin"
            style={{ maxHeight: "calc(80vh - 120px)" }}
          >
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500">Start chatting!</div>
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus_ring-blue-500 disabled:opacity-50"
              placeholder={
                isLoaded && !userId ? "Sign in to chat" : "Ask a question..."
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
