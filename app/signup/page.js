'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function SignUp() {
  const supabase = createClient();
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("Signup Data:", data);
      console.log("Signup Error:", error);

      if (error) throw error;

      alert("Registration successful! Please check your email.");

      router.push("/login");

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 
      FIX FOR ROOT LAYOUT OVERFLOW-HIDDEN:
      We make this container exactly the full size of the screen (`w-screen h-screen`), 
      and give it its own isolated vertical scroll engine (`overflow-y-auto`).
      'flex justify-center items-start sm:items-center' centers the form cleanly on big screens,
      but keeps it safe at the top with natural padding on smaller/shorter screens.
    */
    <div className="w-screen h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background Soft Ambient Light Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Form White Card - Added 'my-auto' to ensure uniform margins at the top/bottom when scrolling */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 my-auto transition-all duration-500 animate-fade-in">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => router.back()} className="text-blue-900/70 hover:text-blue-950 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        </div>

        {/* Brand Logo and Headings */}
        <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
           <Link href="/" className="inline-block">
  <Image
    src="/images/ai.png"
    alt="AI Chatbot Logo"
    width={100}
    height={100}
    className="object-contain transition-transform duration-300 hover:scale-105"
  />
</Link>
          </div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-1">Hello there!</h1>
          <p className="text-blue-900/70 text-sm">Please enter your details to create an account</p>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold leading-relaxed animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name Input */}
          <div className="group">
            <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-700">Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe" 
              className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300"
            />
          </div>

          {/* Email Input */}
          <div className="group">
            <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-700">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-700">Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300 pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900/60 hover:text-blue-950 text-xs font-semibold focus:outline-none transition-colors">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="group">
            <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-700">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300 pr-12"
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900/60 hover:text-blue-950 text-xs font-semibold focus:outline-none transition-colors">
                {showConfirmPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
       <div className="flex items-start gap-3 pt-1">
  <input
    type="checkbox"
    id="terms"
    checked={agreeTerms}
    onChange={(e) => setAgreeTerms(e.target.checked)}
    className="w-5 h-5 rounded border-blue-300 text-blue-700 focus:ring-blue-700 mt-0.5 cursor-pointer accent-blue-700"
  />

  <label
    htmlFor="terms"
    className="text-sm text-blue-900/70 select-none cursor-pointer"
  >
    I agree to the{" "}
    <Link
      href="/dashboard/terms"
      className="underline text-blue-950 font-semibold hover:text-blue-700 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      Terms & Conditions
    </Link>
  </label>
</div>

          {/* Submit Action Buttons */}
          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 text-center text-sm"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>
            <p className="text-center text-xs text-blue-900/70 mt-4">
              Already have an account? <Link href="/login" className="text-blue-700 font-bold underline hover:text-blue-800 transition-colors">Log In</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}