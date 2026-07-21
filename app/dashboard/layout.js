// app/(dashboard)/layout.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Users, Clock, Settings } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Route map matching your folder structure
  const navItems = [
     { id: "chat", label: "New Chat", href: "/dashboard/ai-helpers", icon: MessageSquare },
    { id: "assistants", label: "AI Assistants", href: "/dashboard/chat", icon: Users },
   

    { id: "history", label: "History", href: "/history", icon: Clock },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F8FF] flex flex-col md:flex-row">
      {/* Navigation Sidebar / Bottom Bar */}
      <nav className="fixed z-50 bg-white border-gray-100 shadow-sm
        bottom-0 left-0 right-0 border-t py-2 px-6
        md:top-0 md:bottom-auto md:right-auto md:w-64 md:h-screen md:border-t-0 md:border-r md:p-6 md:flex md:flex-col md:justify-start"
      >
        <div className="hidden md:block mb-8 px-2 font-bold text-lg text-gray-800">
          AI Chatbot
        </div>

        <ul className="flex items-center justify-between md:flex-col md:items-start md:justify-start md:space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Matches current route to select active icon
            const isActive = pathname === item.href;

            return (
              <li key={item.id} className="w-full">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 transition-colors flex-col md:flex-row md:px-3 md:py-2.5 md:rounded-xl ${
                    isActive 
                      ? "text-[#3B38D8] md:bg-[#3B38D8]/10 font-semibold" 
                      : "text-gray-500 hover:text-gray-900 md:hover:bg-gray-50"
                  }`}
                >
                  {isActive ? (
                    <div className="w-7 h-7 rounded-full bg-[#3B38D8] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}