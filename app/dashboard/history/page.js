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
  const [swipedId, setSwipedId] = useState(null); // Tracks which item is swiped left on mobile

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
    <div className="min-h-screen bg-white text-gray-950 flex flex-col items-center">
      {/* Responsive Container: max-w-md for mobile, expands to max-w-2xl or max-w-3xl on md/lg screens */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen p-4 md:p-8 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between py-3 mb-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          
          <h1 className="text-xl md:text-2xl font-semibold text-gray-950">History</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleClearAll} 
              title="Clear all history"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden md:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="mb-6 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        {/* History List */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-6">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading history...</p>
          ) : filteredHistory.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No search history found.</p>
          ) : (
            filteredHistory.map((item) => {
              const isSwiped = swipedId === item.id;
              return (
                <div key={item.id} className="relative overflow-hidden rounded-2xl group">
                  
                  {/* Delete Action Background revealed on swipe left (Mobile) */}
                  <div className="absolute inset-y-0 right-0 w-24 bg-red-500 flex items-center justify-center text-white cursor-pointer rounded-r-2xl z-0 md:hidden">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Main Card Element */}
                  <div
                    onTouchStart={(e) => {
                      const touchX = e.touches[0].clientX;
                      e.currentTarget.dataset.startX = touchX;
                    }}
                    onTouchEnd={(e) => {
                      const touchX = e.changedTouches[0].clientX;
                      const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                      if (startX - touchX > 50) {
                        setSwipedId(item.id); // Swipe Left detected
                      } else if (touchX - startX > 50) {
                        setSwipedId(null); // Swipe Right to close
                      }
                    }}
                    style={{
                      transform: isSwiped ? 'translateX(-80px)' : 'translateX(0px)',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    className="relative z-10 bg-gray-50 hover:bg-gray-100 p-4 md:p-5 rounded-2xl flex items-center justify-between cursor-pointer border border-gray-100 transition-colors"
                    onClick={() => router.push(`/dashboard/ai-helpers?query=${encodeURIComponent(item.query)}`)}
                  >
                    <div className="pr-2 flex-1">
                      <h2 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
                        {item.query}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        | {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Desktop Direct Delete Button (Visible on hover on larger screens) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="hidden md:flex opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
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