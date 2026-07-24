'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { ArrowLeft, Search, Trash2, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Initialize the Supabase client instance here
const supabase = createClient();

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States for JS-powered touch tracking
  const [swipedId, setSwipedId] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);
  const [activeTouchId, setActiveTouchId] = useState(null);

  // Fetch chat history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setSwipedId(null);
    setTouchCurrentX(0);

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete', error);
      fetchHistory(); // Revert on failure
    }
  };

  const handleClearAll = async () => {
    setHistory([]);
    try {
      await fetch('/api/history/clear', { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to clear history', error);
      fetchHistory();
    }
  };

  const filteredHistory = history.filter((item) =>
    item.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-white text-gray-950 flex flex-col items-center selection:bg-gray-200">
      {/* Responsive Container: max-w-md for mobile, expands to max-w-2xl or max-w-3xl on md/lg screens */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen p-4 md:p-8 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between py-3 mb-4 animate-fade-in">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 hover:border-gray-200 active:scale-95 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">History</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleClearAll} 
              title="Clear all history"
              className="px-3.5 py-2 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all duration-200 text-gray-700 hover:text-red-600 flex items-center gap-2 text-sm font-medium group"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden md:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="mb-6 relative group">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-black" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-300 placeholder:text-gray-400"
          />
        </div>

        {/* History List */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-6 scrollbar-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-2 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">No search history found.</p>
              <p className="text-xs text-gray-400">Try searching for something else or start a new chat.</p>
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const isSwiped = swipedId === item.id;
              
              // Compute dynamic translation offset using JS states
              let translateX = 0;
              if (isSwiped) {
                translateX = -80;
              }
              if (activeTouchId === item.id) {
                const diff = touchCurrentX - touchStartX;
                translateX = Math.min(0, Math.max(-80, diff));
              }

              return (
                <div 
                  key={item.id} 
                  className="relative overflow-hidden rounded-2xl group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  
                  {/* Delete Action Background revealed on swipe left (Mobile) */}
                  <div className="absolute inset-y-0 right-0 w-24 bg-red-500 flex items-center justify-center text-white cursor-pointer rounded-r-2xl z-0 md:hidden">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full h-full flex items-center justify-center active:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 animate-pulse" />
                    </button>
                  </div>

                  {/* Main Card Element with JS Touch Handlers */}
                  <div
                    onTouchStart={(e) => {
                      setActiveTouchId(item.id);
                      setTouchStartX(e.touches[0].clientX);
                      setTouchCurrentX(e.touches[0].clientX);
                    }}
                    onTouchMove={(e) => {
                      if (activeTouchId !== item.id) return;
                      setTouchCurrentX(e.touches[0].clientX);
                    }}
                    onTouchEnd={() => {
                      if (activeTouchId !== item.id) return;
                      const distance = touchCurrentX - touchStartX;
                      
                      if (distance < -40) {
                        setSwipedId(item.id);
                      } else if (distance > 40) {
                        setSwipedId(null);
                      }
                      setActiveTouchId(null);
                    }}
                    style={{
                      transform: `translateX(${translateX}px)`,
                      transition: activeTouchId === item.id ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="relative z-10 bg-white/95 backdrop-blur-sm hover:bg-gray-50/80 p-4 md:p-5 rounded-2xl flex items-center justify-between cursor-pointer border border-gray-100/80 shadow-2xs transition-colors duration-200"
                    onClick={() => {
                      if (!isSwiped) {
                        router.push(`/dashboard/ai-helpers?query=${encodeURIComponent(item.query)}`);
                      }
                    }}
                  >
                    <div className="pr-2 flex-1">
                      <h2 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 tracking-tight group-hover:text-black transition-colors">
                        {item.query}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium">
                        <span>
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Desktop Direct Delete Button (Visible on hover on larger screens) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="hidden md:flex opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 shrink-0 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}