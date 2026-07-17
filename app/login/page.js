'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setErrorMsg("Please register your account first before attempting to sign in.");
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    /* 
      FIX FOR ROOT LAYOUT OVERFLOW-HIDDEN:
     
    */
    <div className="w-screen h-screen bg-gray-50 flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Centered White Card Asset (Matches your Signup form design perfectly) */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 my-auto">
        
        {/* Brand Logo and Top Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-4">
            Logo
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to safely manage your secure panel</p>
        </div>

        {/* Alert Messaging */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Processing */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 text-sm transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-purple-600 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-900 text-sm transition pr-12"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium focus:outline-none"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Action Buttons inside standard document flow */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-50 text-center text-sm"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Don't have an account? <Link href="/signup" className="text-purple-600 font-semibold underline hover:text-purple-700">Register here</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}