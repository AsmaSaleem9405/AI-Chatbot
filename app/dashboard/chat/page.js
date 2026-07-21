// app/(dashboard)/chat/page.js
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, Loader2 } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    "Draft a professional email",
    "Explain quantum computing",
    "Write a Next.js component",
    "Brainstorm social media content",
  ];

  // Auto-scroll to the bottom of the chat on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: currentTime,
    };

    // Update state immediately with user message
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: query,
          // Optional: pass chat history if your API route expects it
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI");
      }

      const data = await response.json();

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        // Fallback checks depending on how your API formats the output JSON
        text: data.text || data.response || data.message || "I couldn't process that response.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);

      const errorMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Sorry, I ran into an error getting a response. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="chat-page"
      className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-[#F8F8FF] p-4 md:p-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3B38D8] text-white flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">AI Assistant</h1>
            <p className="text-xs text-green-500 font-medium">● Online</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Message Container */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3">
            <Sparkles className="w-10 h-10 text-[#3B38D8]" />
            <p className="text-sm font-medium">Start a conversation or pick a topic below!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                  msg.sender === "user" ? "bg-gray-800" : "bg-[#3B38D8]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#3B38D8] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    msg.sender === "user" ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-[#3B38D8] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-gray-500 rounded-2xl rounded-tl-none border border-gray-100 px-4 py-3 text-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#3B38D8]" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length < 3 && !isLoading && (
        <div className="flex flex-wrap gap-2 my-3 shrink-0">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-[#3B38D8] transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:border-[#3B38D8] transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#3B38D8] hover:bg-[#2F2CB5] disabled:bg-gray-200 text-white flex items-center justify-center transition-colors shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}