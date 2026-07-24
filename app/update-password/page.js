'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";


export default function UpdatePassword() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // This updates the user password for the currently active session
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Password updated successfully! Redirecting you to the login page...");
      
      // Clear out active temporary recovery session so they log in cleanly
      await supabase.auth.signOut();

      // Delay for 2 seconds so they can see the success state
      setTimeout(() => {
        router.push('/login'); 
      }, 2000);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#EBF4FF] to-white flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl shadow-sky-900/5 border border-sky-100/80 my-auto transform transition-all duration-500 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
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
         
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Password</h1>
          <p className="text-gray-500 text-sm mt-1.5">Please enter your secure new access credentials below</p>
        </div>

        {/* Messaging Alerts */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/80 text-amber-800 rounded-2xl text-xs font-semibold leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/80 text-emerald-800 rounded-2xl text-xs font-semibold leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {successMsg}
          </div>
        )}

        {/* Update Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3.5 bg-sky-50/30 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white text-gray-900 text-sm transition-all duration-300 pr-12 placeholder:text-gray-400"
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold focus:outline-none transition-colors"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 text-center text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}