'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { ArrowLeft, User, Pencil, Loader2 } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
  });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    }
    getUser();
  }, [supabase]);

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
      
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No active user found');

      const updates = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      // 1. Save to Supabase DB
      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      // 2. Save to LocalStorage for instant UI updates on next page
      localStorage.setItem('user_profile', JSON.stringify({
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        image: avatarUrl
      }));

      // 3. Navigate to dashboard
      router.push('/dashboard/ai-helpers');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-white flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 animate-fadeIn">
      
      {/* Container Card with smooth entrance scale and fade animation */}
      <div className="w-full max-w-md mt-35 bg-white/80 backdrop-blur-xl h-auto rounded-[32px] shadow-2xl shadow-blue-500/10 flex flex-col p-6 md:p-8 border border-white/60 transition-all duration-500 hover:shadow-blue-500/20 animate-scaleUp">
        
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-black self-start mb-5 p-2 hover:bg-blue-100/50 rounded-full transition-all duration-300 hover:-translate-x-1 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 transition-transform duration-300 hover:rotate-[-10deg]" />
        </button>

        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <h1 className="text-2xl font-extrabold text-black tracking-tight mb-1 animate-slideDown">
            Finish up your profile!
          </h1>
          <p className="text-gray-500 text-sm mb-8 animate-slideDown delay-100">
            Complete your profile before jumping in!
          </p>

          {/* Profile Picture Uploader Element with pulse/bounce micro-interactions */}
          <div className="relative self-center mb-8 group animate-scaleUp delay-150">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border border-blue-200/60 overflow-hidden shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-md">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <User className="w-10 h-10 text-blue-400 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
              )}
            </div>
            <label 
              htmlFor="avatar-input" 
              className="absolute bottom-[-4px] right-[-4px] bg-indigo-700 p-2 rounded-full text-white cursor-pointer shadow-lg shadow-indigo-700/30 hover:bg-indigo-800 hover:scale-110 active:scale-95 transition-all duration-300 block animate-bounce-short"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-12" />}
            </label>
            <input 
              type="file" 
              id="avatar-input" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              className="hidden" 
              disabled={uploading}
            />
          </div>

          {/* Input Fields Stack with smooth slide-in animation */}
          <div className="border border-blue-100 rounded-2xl overflow-hidden divide-y divide-blue-100 shadow-sm mb-8 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 animate-slideUp delay-200">
            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-4 text-black bg-transparent placeholder-gray-400 focus:outline-hidden text-[15px] transition-all duration-300 focus:bg-white/80 focus:pl-6"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-4 text-black bg-transparent placeholder-gray-400 focus:outline-hidden text-[15px] transition-all duration-300 focus:bg-white/80 focus:pl-6"
            />
            <div className="relative w-full bg-transparent transition-all duration-300 focus-within:bg-white/80">
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-4 text-black bg-transparent placeholder-gray-400 focus:outline-hidden text-[15px] appearance-none cursor-pointer pr-10 transition-all duration-300 focus:pl-6"
              >
                <option value="" disabled hidden className="text-gray-400">Gender</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
                <option value="Other" className="text-black">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4 transition-transform duration-300 hover:scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Date of birth"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => !e.target.value && (e.target.type = "text")}
              required
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="w-full px-4 py-4 text-black bg-transparent placeholder-gray-400 focus:outline-hidden text-[15px] transition-all duration-300 focus:bg-white/80 focus:pl-6"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-indigo-700 text-white font-semibold py-4 rounded-3xl shadow-lg shadow-indigo-700/25 hover:bg-indigo-800 hover:shadow-indigo-800/40 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 transition-all duration-300 flex justify-center items-center gap-2 text-[15px] cursor-pointer animate-slideUp delay-300"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Let's keep going!
          </button>
        </form>
      </div>

      {/* Tailwind Custom Keyframes for Smooth Professional Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}