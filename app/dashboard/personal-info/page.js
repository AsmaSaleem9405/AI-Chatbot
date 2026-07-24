'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { ArrowLeft, User, Mail, Calendar, Users, Loader2, Pencil } from 'lucide-react';

export default function PersonalInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
        }

        if (data) {
          setProfile({
            name: data.name || '',
            email: data.email || user.email || '',
            gender: data.gender || 'Not specified',
            dob: data.dob || 'Not specified',
            avatar_url: data.avatar_url || '',
          });
        } else {
          setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [supabase, router]);

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
      const newAvatarUrl = data.publicUrl;

      const updates = {
        id: user.id,
        name: profile.name,
        email: profile.email,
        gender: profile.gender,
        dob: profile.dob,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase.from('profiles').upsert(updates);
      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-white flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-700" />
      </div>
    );
  }

  return (
    /* Fixed height viewport with explicit vertical scrolling ONLY inside this page container */
    <div className="w-full h-screen bg-gradient-to-b from-white via-slate-50/30 to-white overflow-y-auto py-8 px-6 sm:px-12 lg:px-20 transition-all">
      <div className="w-full max-w-4xl mx-auto flex flex-col pb-20 animate-fadeIn duration-500">
        
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="text-black self-start mb-6 p-2.5 hover:bg-gray-100/80 active:scale-95 rounded-full transition-all duration-200 shadow-xs hover:shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="w-full flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-2">
            Personal Information
          </h1>
          <p className="text-gray-500 text-base mb-10">
            View your profile details, picture, and account settings.
          </p>

          {/* Profile Picture Display with Upload functionality */}
          <div className="relative self-center mb-10 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-blue-50/70 rounded-3xl flex items-center justify-center border border-blue-100 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <User className="w-12 h-12 text-blue-300" />
              )}
            </div>
            <label 
              htmlFor="avatar-input" 
              className="absolute bottom-[-4px] right-[-4px] bg-indigo-700 p-2.5 rounded-full text-white cursor-pointer shadow-lg hover:bg-indigo-800 hover:scale-105 active:scale-95 transition-all duration-200 block"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
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

          {/* Details List Stack */}
          <div className="w-full border border-gray-200/80 rounded-3xl overflow-hidden divide-y divide-gray-100 shadow-sm mb-10 bg-white/80 backdrop-blur-md transition-all">
            <div className="w-full px-6 py-5 flex items-center justify-between text-base hover:bg-gray-50/50 transition-colors">
              <span className="text-gray-400 flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-600 transition-transform group-hover:scale-110" /> Name
              </span>
              <span className="text-black font-semibold">{profile.name || 'Not set'}</span>
            </div>

            <div className="w-full px-6 py-5 flex items-center justify-between text-base hover:bg-gray-50/50 transition-colors">
              <span className="text-gray-400 flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-600" /> Email
              </span>
              <span className="text-black font-semibold">{profile.email || 'Not set'}</span>
            </div>

            <div className="w-full px-6 py-5 flex items-center justify-between text-base hover:bg-gray-50/50 transition-colors">
              <span className="text-gray-400 flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600" /> Gender
              </span>
              <span className="text-black font-semibold">{profile.gender}</span>
            </div>

            <div className="w-full px-6 py-5 flex items-center justify-between text-base hover:bg-gray-50/50 transition-colors">
              <span className="text-gray-400 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" /> Date of Birth
              </span>
              <span className="text-black font-semibold">{profile.dob}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/profile-setup')}
            className="w-full max-w-md mx-auto bg-indigo-700 text-white font-semibold py-4 rounded-3xl shadow-md hover:bg-indigo-800 hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 text-base mb-12"
          >
            Edit Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}