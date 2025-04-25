// components/Chatbot.tsx
"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post<{ reply: string }>(
        "/api/chat",
        { message },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply },
      ]);
      setMessage("");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error sending message:",
        axiosError.response?.data || axiosError.message
      );
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            axiosError.response?.status === 429
              ? "Rate limit exceeded. Try again later."
              : "Error: Try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4">
      <div className="h-64 overflow-y-auto mb-2">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`mb-2 ${
              chat.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded ${
                chat.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {chat.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        className="w-full p-2 border rounded disabled:opacity-50"
        placeholder="Ask a question..."
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && !isLoading && sendMessage()
        }
        disabled={isLoading}
      />
      <button
        type="button" // Prevent form submission
        onClick={sendMessage}
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Chatbot;
