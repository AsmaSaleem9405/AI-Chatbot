'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="w-screen h-screen bg-gray-50 flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Form White Card - Added 'my-auto' to ensure uniform margins at the top/bottom when scrolling */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 my-auto">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        </div>

        {/* Headings */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Hello there!</h1>
          <p className="text-gray-500 text-sm">Please enter your details to create an account</p>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium focus:outline-none">
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPass ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition pr-12"
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium focus:outline-none">
                {showConfirmPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 pt-1">
            <input 
              type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-500 select-none cursor-pointer">
              I agree to the <span className="underline text-gray-700 font-medium">Terms & Conditions</span>
            </label>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-50 text-center text-sm"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account? <Link href="/login" className="text-purple-600 font-semibold underline hover:text-purple-700">Log In</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}