// app/profile-setup/page.js
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

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      router.push('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 
      Outer Wrapper: Switched to a CSS Grid layout (`grid place-items-center content-center`).
      This automatically handles vertical centering on large monitors, but if the laptop screen 
      is short, it defaults cleanly to standard page layout and scrolls the entire window 
      without trapping the scrollbar inside the form or cutting off the bottom button.
    */
    <div className="w-screen h-screen bg-gray-50 flex justify-center items-start sm:items-center overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Container Card */}
      <div className="w-full max-w-md mt-35 bg-white h-auto rounded-[32px] shadow-2xl flex flex-col p-6 md:p-8 border border-white/10">
        
        {/* Back Action button */}
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-black self-start mb-5 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Form Body Setup */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          
          <h1 className="text-2xl font-extrabold text-black tracking-tight mb-1">
            Finish up your profile!
          </h1>
          <p className="text-black text-sm mb-8">
            Complete your profile before to jump in!
          </p>

          {/* Profile Picture Uploader Element */}
          <div className="relative self-center mb-8">
            <div className="w-24 h-24 bg-blue-50/70 rounded-3xl flex items-center justify-center border border-blue-100 overflow-hidden shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-blue-300" />
              )}
            </div>
            <label 
              htmlFor="avatar-input" 
              className="absolute bottom-[-4px] right-[-4px] bg-indigo-700 p-2 rounded-full text-white cursor-pointer shadow-md hover:bg-indigo-800 active:scale-95 transition-all block"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />}
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

          {/* Input Fields Stack */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200 shadow-xs mb-8">
            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-4 text-black bg-white placeholder-gray focus:outline-hidden text-[15px]"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-4 text-black bg-white placeholder-gray focus:outline-hidden text-[15px]"
            />
            <div className="relative w-full bg-white">
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-4 text-black bg-transparent placeholder-gray focus:outline-hidden text-[15px] appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled hidden className="text-black">Gender</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
                <option value="Other" className="text-black">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
              className="w-full px-4 py-4 text-black bg-white placeholder-gray focus:outline-hidden text-[15px]"
            />
          </div>

          {/* Submission Action Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-indigo-700 text-white font-semibold py-4 rounded-3xl shadow-sm hover:bg-indigo-800 active:scale-[0.98] disabled:opacity-70 transition-all flex justify-center items-center gap-2 text-[15px]"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Let's keep going!
          </button>

        </form>
      </div>
    </div>
  );
}