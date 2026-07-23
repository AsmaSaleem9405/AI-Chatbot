"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Onboarding() {
  const router = useRouter();
  
  return (
    // Uses h-screen on desktop to prevent overflow, and min-h-screen on mobile for comfortable natural scrolling
    <div className="min-h-screen md:h-screen bg-white flex flex-col md:flex-row font-sans overflow-x-hidden md:overflow-hidden">
      
      {/* Left Section: Mockup Image Area */}
      {/* Set to 50vh on mobile so the screen is cleanly split between the mockup and the text */}
      <div className="w-full md:w-1/2 bg-[#f4f6fa] flex items-center justify-center p-6 md:p-12 h-[50vh] md:h-full relative overflow-hidden transition-colors duration-500">
        
        {/* Soft Radial Glow / Light Highlight effect with subtle pulsing animation */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-purple-200 to-indigo-100 rounded-full blur-[80px] md:blur-[100px] opacity-70 pointer-events-none animate-pulse" />

        {/* Mockup Container: Added smooth float & entrance animations */}
        <div className="relative h-full max-h-[40vh] md:max-h-none w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-[9/19] flex items-center justify-center drop-shadow-2xl z-10 transition-all duration-300 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl filter blur-xl transform scale-95" />
          <img
            src="/images/phone.png" // Ensure this file is sitting in your /public folder
            alt="SparkGPT Mobile App Chat Mockup"
            className="w-full h-full object-contain transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-[0_20px_30px_rgba(59,47,196,0.15)]"
          />
        </div>
      </div>

      {/* Right Section: Content & Actions */}
      {/* On mobile, it takes the remaining height seamlessly with uniform padding */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center md:items-start p-6 sm:p-10 md:p-16 text-center md:text-left md:h-full">
        <div className="max-w-md w-full flex flex-col justify-center py-4 md:py-0 animate-[fadeInRight_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          
          {/* Main Typography Group */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight transition-all duration-300">
              Chat without limits, 
              anytime
            </h2>

            <p className="mt-3 md:mt-4 text-sm sm:text-base text-gray-500 font-normal leading-relaxed max-w-xs sm:max-w-sm md:max-w-sm mx-auto md:mx-0">
              Whether you need quick answers, creative ideas, or just a smart
              conversation, SparkGPT is here to assist you instantly.
            </p>
          </div>

          {/* Action Buttons Container */}
          {/* Added enhanced shadow states and smooth hover scale micro-interactions */}
          <div className="w-full mt-8 md:mt-10 max-w-xs sm:max-w-sm md:max-w-xs mx-auto md:mx-0">
            <Link href="/welcome" className="w-full block group">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full font-bold text-white bg-[#3b2fc4] hover:bg-[#3126a4] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Next
              </button>
            </Link>
          </div>
          
        </div>
      </div>

      {/* Custom Keyframes injection for smooth professional page entrance */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}