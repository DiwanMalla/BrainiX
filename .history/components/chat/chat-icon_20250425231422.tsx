"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Chat() {
  const { isSignedIn } = useUser();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    if (!isSignedIn) return alert("Please sign in");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const { reply, error } = await res.json();
    if (error) return alert(error);
    setReply(reply);
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={sendMessage}>Send</button>
      <p>{reply}</p>
    </div>
  );
}
