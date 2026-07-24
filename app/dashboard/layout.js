// app/(dashboard)/layout.js
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Users, Clock, Settings } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Route map matching your folder structure
  const navItems = [
    { id: "chat", label: "New Chat", href: "/dashboard/ai-helpers", icon: MessageSquare },
    { id: "assistants", label: "AI Assistants", href: "/dashboard/chat", icon: Users },
    { id: "history", label: "History", href: "/dashboard/history", icon: Clock },
    { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F8FF] flex flex-col md:flex-row selection:bg-[#3B38D8]/20">
      {/* Navigation Sidebar / Bottom Bar */}
      <nav className="fixed z-50 bg-white/90 backdrop-blur-md border-gray-100 shadow-lg shadow-gray-200/40
        bottom-0 left-0 right-0 border-t py-2 px-6
        md:top-0 md:bottom-auto md:right-auto md:w-64 md:h-screen md:border-t-0 md:border-r md:p-6 md:flex md:flex-col md:justify-start
        transition-all duration-300"
      >
        <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <Image
            src="/images/ai.png"
            alt="AI Chatbot Logo"
            width={90}
            height={90}
            className="object-contain -mt-5 ml-12"
          />
        </Link>

        <ul className="flex items-center justify-between md:flex-col md:items-start md:justify-start md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Matches current route to select active icon
            const isActive = pathname === item.href;

            return (
              <li key={item.id} className="w-full">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 transition-all duration-200 ease-in-out flex-col md:flex-row md:px-3.5 md:py-3 md:rounded-xl group ${
                    isActive 
                      ? "text-[#3B38D8] md:bg-[#3B38D8]/10 font-semibold shadow-sm shadow-[#3B38D8]/5" 
                      : "text-gray-500 hover:text-gray-900 md:hover:bg-gray-50/80"
                  }`}
                >
                  {isActive ? (
                    <div className="w-7 h-7 rounded-full bg-[#3B38D8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#3B38D8]/30 transition-transform duration-300 scale-105">
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                      <Icon className="w-5 h-5 text-gray-500 group-hover:text-[#3B38D8] transition-colors duration-200" />
                    </div>
                  )}
                  <span className="text-xs md:text-sm tracking-tight transition-colors">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-64 transition-all duration-300 animate-fadeIn">
        {children}
      </main>
    </div>
  );
}