import Image from "next/image";
import Link from "next/link"; // Imported for routing

export default function WelcomePage() {
  return (
    // min-h-screen ensures the page takes up the whole screen on mobile, 
    // while h-screen on md devices locks it to a single view.
    <main className="min-h-screen md:h-screen w-full bg-white flex flex-col md:flex-row m-0 p-0 overflow-x-hidden md:overflow-hidden">
      
      {/* Left Column: Fixed to 40% height on mobile viewports so it doesn't crowd out the text */}
      <div className="w-full md:w-1/2 bg-[#EEF2FD] p-6 md:p-12 flex items-center justify-center relative h-[40vh] md:h-full overflow-hidden">
        
        {/* Abstract Background Shapes - Hidden on small mobile screens to keep it clean, visible on sm and up */}
        <div className="hidden sm:block absolute top-8 -left-5 w-48 h-12 bg-[#E3E8F8] rounded-full opacity-70"></div>
        <div className="hidden sm:block absolute top-20 left-10 w-64 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="hidden sm:block absolute top-44 left-4 w-52 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="hidden sm:block absolute bottom-20 left-16 w-60 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="hidden sm:block absolute bottom-6 left-10 w-44 h-12 bg-[#E3E8F8] rounded-full opacity-50"></div>

        {/* Centered Decorative Logo Ring Container */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {/* Managed Next.js image scaling by tying it to responsive max-widths */}
          <div className="relative w-full max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px] aspect-square">
            <Image
              src="/images/logo-1.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Column: Content & Actions filling the remaining screen space smoothly */}
      <div className="w-full md:w-1/2 bg-white px-6 py-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center items-center md:items-start h-[60vh] md:h-full">
        
        {/* Text Content */}
        <div className="text-center md:text-left max-w-sm sm:max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Insert content here
          </h1>
          <p className="text-gray-500 mt-4 text-sm sm:text-base lg:text-lg leading-relaxed">
            Create your account in seconds and unlock the full potential of
            AI-powered conversations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 md:mt-12 space-y-3.5 max-w-sm sm:max-w-md w-full">
          {/* Link to Login page */}
          <Link href="/login" className="block w-full">
            <button className="w-full h-12 sm:h-14 rounded-full bg-[#3F37C9] text-white font-semibold shadow-lg shadow-indigo-600/10 hover:bg-[#372FB5] hover:shadow-xl hover:shadow-indigo-600/20 active:scale-[0.99] transition-all duration-200">
              Log in
            </button>
          </Link>

          {/* Link to Signup page */}
          <Link href="/signup" className="block w-full">
            <button className="w-full h-12 sm:h-14 rounded-full bg-[#F0F3FF] text-[#3F37C9] font-semibold hover:bg-[#E5E9FA] active:scale-[0.99] transition-all duration-200">
              Sign Up
            </button>
          </Link>
        </div>

      </div>

    </main>
  );
}