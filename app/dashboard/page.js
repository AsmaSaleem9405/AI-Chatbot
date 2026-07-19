'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Initialize the supabase client instance
const supabase = createClient();

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileSubscription = null;

    async function fetchProfileAndSubscribe() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // 1. Initial State Fetch
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);

        // 2. Realtime listener initialization
        profileSubscription = supabase
          .channel('public:profiles')
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
            (payload) => {
              // Automatically updates the state as changes stream in live
              setProfile(payload.new);
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Error fetching dashboard real-time data status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndSubscribe();

    // Disconnect listener on component unmount
    return () => {
      if (profileSubscription) supabase.removeChannel(profileSubscription);
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center">
      {/* Top Header Controls Container */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight">System Dashboard</h1>
        <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-xl text-sm border border-red-500/30 hover:bg-red-600/30 transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Main Profile Account Visualizer Panel */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
        
        {/* Live sync badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <RefreshCw className="w-3 h-3 animate-spin" /> Real-time active
        </div>

        <div className="flex flex-col items-center pt-4">
          <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-indigo-500 overflow-hidden mb-4 shadow-xl">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-900/40 text-indigo-300 text-2xl font-bold">
                {profile?.name ? profile.name[0].toUpperCase() : '?'}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mb-1">{profile?.name || 'Anonymous User'}</h2>
          <p className="text-gray-400 text-sm mb-6">{profile?.email}</p>

          <div className="w-full bg-gray-950 rounded-2xl border border-gray-800/60 divide-y divide-gray-800/40">
            <div className="p-4 flex justify-between">
              <span className="text-gray-400 text-sm">Gender</span>
              <span className="font-medium text-gray-200">{profile?.gender || 'Not specified'}</span>
            </div>
            <div className="p-4 flex justify-between">
              <span className="text-gray-400 text-sm">Date of Birth</span>
              <span className="font-medium text-gray-200">{profile?.dob || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}