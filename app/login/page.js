"use client";
import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Login() {
  const supabase = createClient();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setErrorMsg(
          "Please register your account first before attempting to sign in.",
        );
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.push("/profile-setup");
    }
  };

  return (
    /* 
      FIX FOR ROOT LAYOUT OVERFLOW-HIDDEN:
     */
    <div className="w-screen h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Soft Ambient Light Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Centered White Card Asset (Matches your Signup form design perfectly) */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 my-auto transition-all duration-500 animate-fade-in">
        {/* Brand Logo and Top Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
           <Link href="/" className="inline-block">
  <Image
    src="/images/nexora.png"
    alt="AI Chatbot Logo"
    width={100}
    height={100}
    className="object-contain transition-transform duration-300 hover:scale-105"
  />
</Link>
          </div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-blue-900/70 text-sm mt-1">
            Log in to safely manage your secure panel
          </p>
        </div>

        {/* Alert Messaging */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold leading-relaxed animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Form Processing */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="group">
            <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-1 transition-colors group-focus-within:text-blue-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300"
            />
          </div>

          {/* Password Field */}
          <div className="group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider transition-colors group-focus-within:text-blue-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-700 font-semibold hover:underline transition-colors"
              >
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
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white text-blue-950 placeholder-blue-400 text-sm transition-all duration-300 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-900/60 hover:text-blue-950 text-xs font-semibold focus:outline-none transition-colors"
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
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 text-center text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-xs text-blue-900/70 mt-4">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-700 font-bold underline hover:text-blue-800 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
