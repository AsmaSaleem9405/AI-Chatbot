'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/app/components/AuthLayout';

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

    setLoading(true);

    // Supabase Sign Up API call
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        // Redirect back to login or dashboard post email confirmation if enabled
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      // Supabase behavior check: If user already exists and email confirmation is on, 
      // it won't throw an error directly for security, but we can detect identities structure
      if (data?.user?.identities?.length === 0) {
        setErrorMsg("This email already has an account. Please log in.");
      } else {
        alert("Registration successful! Check your email for verification.");
        router.push('/login');
      }
    }
  };

  return (
    <AuthLayout>
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <button onClick={() => router.back()} className="text-gray-800 hover:text-black">
          {/* Back Arrow Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>

      {/* Hero Headings */}
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Hello there!</h1>
      <p className="text-gray-500 text-sm mb-8">Please enter your details to create an account</p>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form Submission */}
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 placeholder-gray-400 text-sm transition"
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
              {showConfirmPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input 
            type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-500 select-none cursor-pointer">
            I agree to the <span className="underline text-gray-700 font-medium">Terms & Conditions</span>
          </label>
        </div>

        {/* Bottom Floating/Fixed CTA Button Styling */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition active:scale-[0.99] disabled:opacity-50 text-center"
          >
            {loading ? "Creating Account..." : "Continue"}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Already have an account? <Link href="/login" className="text-purple-600 font-semibold underline">Log In</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}