import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <>
      {/* Standard CSS injection compatible with Next.js Server Components */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slowSpin 25s linear infinite;
        }
      `}} />

      {/* 
        GUARANTEED MOBILE SCROLL FIX:
        - Uses `min-h-full` and standard layout flow on mobile so the browser natively treats the document as scrollable.
        - Preserves `md:h-screen md:overflow-hidden` precisely for desktop screens.
      */}
      <main className="min-h-full md:h-screen w-full bg-[#FAFBFC] flex flex-col md:flex-row m-0 p-0 overflow-y-auto md:overflow-hidden selection:bg-[#3F37C9] selection:text-white">
        
        {/* Left Column: Gradient background with rotating logo */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#EEF2FD] via-[#E8EDFC] to-[#DFE6FA] py-16 px-8 flex items-center justify-center relative shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(63,55,201,0.06)_0,transparent_70%)] pointer-events-none"></div>

          {/* Minimalist Professional Geometric Accent Rings */}
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border border-indigo-200/40 pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-indigo-200/40 pointer-events-none"></div>

          {/* Centered Decorative Logo Ring Container with a clean entrance */}
          <div className="relative z-10 flex items-center justify-center w-full">
            {/* Logo container with slow spin animation */}
            <div className="relative w-full max-w-[160px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[380px] aspect-square transition-transform duration-700 hover:scale-[1.02] drop-shadow-[0_10px_30px_rgba(63,55,201,0.07)] animate-slow-spin">
              <Image
                src="/images/logo-1.png"
                alt="NEXORA AI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Column: Content & Actions */}
        <div className="w-full md:w-1/2 bg-white px-6 py-12 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center items-center md:items-start shrink-0 pb-16 md:pb-0">
          
          {/* Professional Text Content */}
          <div className="text-center md:text-left max-w-sm sm:max-w-md w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FD] text-[#3F37C9] text-xs font-semibold tracking-wider uppercase mb-5 border border-[#E0E7FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F37C9]"></span>
              NEXORA AI
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Where conversations meet intelligence.
            </h1>
            <p className="text-gray-500 mt-4 text-sm sm:text-base leading-relaxed font-normal">
              Experience seamless, context-aware AI interactions designed to streamline your workflow and elevate your productivity with NEXORA AI.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 md:mt-10 space-y-3.5 max-w-sm sm:max-w-md w-full">
            <Link href="/login" className="block w-full">
              <button className="w-full h-12 sm:h-13 rounded-xl bg-[#3F37C9] text-white font-medium text-sm sm:text-base shadow-sm hover:bg-[#372FB5] active:scale-[0.99] transition-all duration-150">
                Sign In to Account
              </button>
            </Link>

            <Link href="/signup" className="block w-full">
              <button className="w-full h-12 sm:h-13 rounded-xl bg-white text-gray-700 font-medium text-sm sm:text-base border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 active:scale-[0.99] transition-all duration-150">
                Create Free Account
              </button>
            </Link>
          </div>

        </div>

      </main>
    </>
  );
}