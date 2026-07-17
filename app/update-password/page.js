'use client';
import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';

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

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Password updated successfully! Redirecting you to the login page...");
      
      // Delay for 2 seconds so they can see the success state
      setTimeout(() => {
        router.push('/login'); 
      }, 2000);
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create New Password</h1>
          <p className="text-gray-500 text-sm mt-1">Please enter your secure new access credentials below</p>
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

        {/* Update Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              New Password
            </label>
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

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-50 text-center text-sm"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}