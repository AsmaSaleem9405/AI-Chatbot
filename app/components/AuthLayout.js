// components/AuthLayout.js
import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 md:p-6">
      {/* Desktop Container Card / Mobile Full Screen */}
      <div className="w-full max-w-md h-screen md:h-[850px] bg-white md:rounded-3xl md:shadow-xl flex flex-col justify-between overflow-hidden border border-transparent md:border-gray-100 relative">
        
        {/* Top Status Bar Decoration for Mobile View Mockup */}
        <div className="w-full h-1 bg-purple-700 block md:hidden"></div>
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
}