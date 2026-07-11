import React from 'react';

export default function Onboarding() {
  return (
    // md:h-screen prevents the page from being taller than the laptop screen window
    // On mobile, it allows natural scrolling (min-h-screen)
    <div className="min-h-screen md:h-screen bg-white flex flex-col md:flex-row font-sans overflow-x-hidden md:overflow-hidden">
      
      {/* Left Section: Mockup Image Area */}
      {/* Handled mobile responsiveness by making the height flex-1 or a clean aspect ratio on mobile */}
      <div className="w-full md:w-1/2 bg-[#f4f6fa] flex items-center justify-center p-8 md:p-12 min-h-[45vh] md:min-h-0 md:h-full relative overflow-hidden">
        
        {/* Soft Radial Glow / Light Highlight effect behind the phone */}
        <div className="absolute top-1/4 left-0 md:left-4 w-64 h-64 md:w-82 md:h-82 bg-gradient-to-tr from-purple-200 to-indigo-100 rounded-full blur-[80px] md:blur-[100px] opacity-70 pointer-events-none" />
        
        {/* Responsive max-w rules so it scales down neatly on smaller phones (like iPhone SE) up to desktops */}
        <div className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[400px] aspect-[9/19] flex items-center justify-center drop-shadow-2xl z-10 transition-all duration-300">
          <img 
            src="/images/phone.png" // Ensure this file is sitting in your /public folder
            alt="SparkGPT Mobile App Chat Mockup"
            className="w-full h-full object-contain"
          />
        </div>

      </div>

      {/* Right Section: Content & Actions */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center md:items-start p-6 sm:p-10 md:p-16 text-center md:text-left md:h-full">
        
        <div className="max-w-md w-full flex flex-col h-full justify-center md:justify-center py-4 md:py-0">
          
          {/* Main Typography Group */}
          <div className="mt-2 md:mt-0">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
              Chat without limits, <br className="hidden md:inline" />anytime
            </h2>
            
            <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-sm text-gray-500 font-normal leading-relaxed max-w-xs sm:max-w-sm md:max-w-sm mx-auto md:mx-0">
              Whether you need quick answers, creative ideas, or just a smart conversation, SparkGPT is here to assist you instantly.
            </p>
          </div>

          {/* Action Buttons Container */}
          <div className="w-full flex gap-4 mt-8 md:mt-10 max-w-xs sm:max-w-sm md:max-w-xs mx-auto md:mx-0">
            <button className="flex-1 py-3 px-6 rounded-full font-bold text-[#3b2fc4] bg-[#f4f6fa] hover:bg-[#e8ecf5] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base md:text-sm">
              Skip
            </button>
            <button className="flex-1 py-3 px-6 rounded-full font-bold text-white bg-[#3b2fc4] hover:bg-[#2f24a8] shadow-lg shadow-purple-200 active:scale-[0.98] transition-all duration-200 text-sm sm:text-base md:text-sm">
              Next
            </button>
          </div>
          
        </div>

      </div>

    </div>
  );
}