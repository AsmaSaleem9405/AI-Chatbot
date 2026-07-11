import Image from "next/image";

export default function WelcomePage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col md:flex-row m-0 p-0 overflow-x-hidden">
      
      {/* Left Column: Full height illustration on laptop, responsive on mobile */}
      <div className="w-full md:w-1/2 bg-[#EEF2FD] p-8 md:p-12 flex items-center justify-center relative min-h-[40vh] md:min-h-screen">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-8 left-[-20px] w-48 h-12 bg-[#E3E8F8] rounded-full opacity-70"></div>
        <div className="absolute top-20 left-10 w-64 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="absolute top-44 left-4 w-52 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="absolute bottom-20 left-16 w-60 h-16 bg-[#E3E8F8] rounded-2xl opacity-60"></div>
        <div className="absolute bottom-6 left-10 w-44 h-12 bg-[#E3E8F8] rounded-full opacity-50"></div>

        {/* Centered Decorative Logo Ring Container */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Soft Glow Ambient Effect */}
          
          {/* The Logo Container */}
          <div className="relative ">
            <Image
              src="/images/logo-1.png"
              alt="Logo"
              width={400}
              height={400}
              className="w-90 h-90 md:w-100 md:h-100 object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Column: Content & Actions filling the rest of the screen */}
      <div className="w-full md:w-1/2 bg-white px-6 py-12 md:p-16 lg:p-24 flex flex-col justify-center items-center md:items-start min-h-[60vh] md:min-h-screen">
        
        {/* Text Content */}
        <div className="text-center md:text-left max-w-md w-full">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Insert content here
          </h1>
          <p className="text-gray-500 mt-5 text-base lg:text-lg leading-relaxed">
            Create your account in seconds and unlock the full potential of
            AI-powered conversations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 md:mt-12 space-y-4 max-w-md w-full">
          <button className="w-full h-14 rounded-full bg-[#3F37C9] text-white font-semibold shadow-lg shadow-indigo-600/10 hover:bg-[#372FB5] hover:shadow-xl hover:shadow-indigo-600/20 active:scale-[0.99] transition-all duration-200">
            Log in
          </button>

          <button className="w-full h-14 rounded-full bg-[#F0F3FF] text-[#3F37C9] font-semibold hover:bg-[#E5E9FA] active:scale-[0.99] transition-all duration-200">
            Sign Up
          </button>
        </div>

      </div>

    </main>
  );
}