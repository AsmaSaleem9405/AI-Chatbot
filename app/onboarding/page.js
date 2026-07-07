import React from 'react';

export default function Onboarding() {
  return (
    // md:h-screen prevents the page from being taller than the laptop screen window
    <div className="min-h-screen md:h-screen bg-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Left Section: Mockup Image Area */}
      <div className="w-full md:w-1/2 bg-[#f4f6fa] flex items-center justify-center p-6 md:p-8 min-h-[350px] md:min-h-0 md:h-full relative">
        
        {/* Adjusted max-height so the phone doesn't stretch past the screen vertical space */}
        <div className="relative w-full max-w-[240px] md:max-w-[280px] max-h-[80vh] aspect-[9/19] flex items-center justify-center drop-shadow-2xl">
          <img 
            src="/images/phone.png" // Ensure this file is sitting in your /public folder
            alt="SparkGPT Mobile App Chat Mockup"
            className="w-full h-full object-contain"
          />
        </div>

      </div>

      {/* Right Section: Content & Actions */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center md:items-start p-6 md:p-16 text-center md:text-left md:h-full">
        
        <div className="max-w-md w-full flex flex-col h-full md:justify-center">
          
          {/* Main Typography Group */}
          <div className="mt-4 md:mt-0">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
              Chat without limits, <br className="hidden md:inline" />anytime
            </h2>
            
            <p className="mt-3 md:mt-4 text-sm text-gray-500 font-normal leading-relaxed max-w-xs md:max-w-sm">
              Whether you need quick answers, creative ideas, or just a smart conversation, SparkGPT is here to assist you instantly.
            </p>
          </div>

          {/* Action Buttons Container */}
          <div className="w-full flex gap-4 mt-6 md:mt-10 max-w-xs mx-auto md:mx-0">
            <button className="flex-1 py-3 px-6 rounded-full font-bold text-[#3b2fc4] bg-[#f4f6fa] hover:bg-[#e8ecf5] active:scale-[0.98] transition-all duration-200 text-sm">
              Skip
            </button>
            <button className="flex-1 py-3 px-6 rounded-full font-bold text-white bg-[#3b2fc4] hover:bg-[#2f24a8] shadow-lg shadow-purple-200 active:scale-[0.98] transition-all duration-200 text-sm">
              Next
            </button>
          </div>
          
        </div>

      </div>

    </div>
  );
}