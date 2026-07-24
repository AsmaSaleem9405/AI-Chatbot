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
      className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-gradient-to-br from-[#F8F8FF] via-white to-[#F0F0FF] p-4 md:p-6 max-w-5xl mx-auto selection:bg-[#3B38D8]/20"
    >
      {/* Custom inline styling for smooth scrollbars & message animations */}
      <style jsx global>{`
        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-message {
          animation: messageAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Custom sleek scrollbar */
        #chat-messages-container::-webkit-scrollbar {
          width: 6px;
        }
        #chat-messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        #chat-messages-container::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 9999px;
        }
        #chat-messages-container::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100/80 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B38D8] to-[#5A57F0] text-white flex items-center justify-center shadow-md shadow-[#3B38D8]/20 transition-transform duration-300 hover:scale-105">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">AI Assistant</h1>
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online
            </p>
        </div>
      </div>

      <button
        onClick={() => setMessages([])}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 p-2.5 active:scale-95"
        title="Clear Chat"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>

      {/* Message Container */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3 animate-message">
            <div className="w-16 h-16 rounded-3xl bg-[#3B38D8]/10 flex items-center justify-center text-[#3B38D8] shadow-inner mb-1">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-gray-600">Start a conversation or pick a topic below!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-message ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-300 hover:scale-105 ${
                  msg.sender === "user" ? "bg-gray-900" : "bg-gradient-to-tr from-[#3B38D8] to-[#5A57F0]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#3B38D8] to-[#4F4CE6] text-white rounded-tr-none shadow-[#3B38D8]/10"
                    : "bg-white/90 backdrop-blur-sm text-gray-800 rounded-tl-none border border-gray-100 shadow-gray-100"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right font-medium ${
                    msg.sender === "user" ? "text-blue-100" : "text-gray-400"
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
          <div className="flex items-start gap-3 flex-row animate-message">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3B38D8] to-[#5A57F0] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/90 backdrop-blur-sm text-gray-500 rounded-2xl rounded-tl-none border border-gray-100 px-4 py-3 text-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#3B38D8]" />
              <span className="font-medium">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length < 3 && !isLoading && (
        <div className="flex flex-wrap gap-2 my-3 shrink-0 animate-message">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs font-medium bg-white/80 backdrop-blur-sm border border-gray-200/80 text-gray-600 px-3.5 py-2 rounded-full hover:bg-[#3B38D8]/5 hover:border-[#3B38D8] hover:text-[#3B38D8] transition-all duration-200 shadow-sm active:scale-95"
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
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-100/50 focus-within:border-[#3B38D8] focus-within:ring-4 focus-within:ring-[#3B38D8]/10 transition-all duration-300"
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
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B38D8] to-[#5A57F0] hover:from-[#322fb8] hover:to-[#4a47db] disabled:from-gray-200 disabled:to-gray-200 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-[#3B38D8]/20 disabled:shadow-none shrink-0 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 transition-transform duration-200 hover:translate-x-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}