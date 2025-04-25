"use client";
import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; text: string }[]
  >([]);

  const sendMessage = async () => {
    if (!message) return;
    setChatHistory([...chatHistory, { sender: "user", text: message }]);
    try {
      const response = await axios.post("/api/chat", { message });
      setChatHistory([
        ...chatHistory,
        { sender: "user", text: message },
        { sender: "ai", text: response.data.reply },
      ]);
      setMessage("");
    } catch (error) {
      setChatHistory([
        ...chatHistory,
        { sender: "user", text: message },
        { sender: "ai", text: "Error: Try again." },
      ]);
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
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Ask a question..."
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
