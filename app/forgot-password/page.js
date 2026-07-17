'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';

export default function ForgotPassword() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // This tells Supabase where to redirect the user after they click the email link
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Check your email! We've sent you a secure link to reset your password.");
      setEmail('');
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 my-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-4">
            Logo
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a secure recovery link</p>
        </div>

        {/* Messaging Alerts */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Request Form */}
        <form onSubmit={handleResetRequest} className="space-y-5">
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

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-50 text-center text-sm"
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Remember your password? <Link href="/login" className="text-purple-600 font-semibold underline hover:text-purple-700">Back to Login</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}