'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { 
  Pencil, GraduationCap, Music, BookOpen, Mail, UserCheck, 
  Heart, Smile, ArrowLeft, Send, Sparkles, X, Loader2, 
  Code, Briefcase, Bot, Search, LogOut, ChevronDown, Zap 
} from 'lucide-react';

const CATEGORIES = ['All', 'Writing', 'Business', 'Mental Health', 'Coding', 'Productivity'];

const HELPERS = [
  {
    id: 'essay-writer',
    title: 'Essay Writer',
    category: 'Writing',
    description: 'Craft compelling essays effortlessly.',
    icon: Pencil,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an expert Essay Writer. Help the user draft, outline, and refine well-structured essays.'
  },
  {
    id: 'academic-writer',
    title: 'Academic Writer',
    category: 'Writing',
    description: 'Get structured, research-backed academic content.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an Academic Writing Specialist. Provide scholarly, well-formatted content.'
  },
  {
    id: 'lyrics-songs',
    title: 'Lyrics and Songs',
    category: 'Writing',
    description: 'Turn your ideas into catchy and meaningful lyrics.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are a creative Songwriter and Lyricist.'
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    category: 'Writing',
    description: 'Create engaging and immersive stories in seconds.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1474939557375-0047f6e8178f?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are a Master Storyteller.'
  },
  {
    id: 'email-creator',
    title: 'Email Creator',
    category: 'Business',
    description: 'Write professional and polished emails instantly.',
    icon: Mail,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an Executive Communication Expert.'
  },
  {
    id: 'interview-coach',
    title: 'Interview Coach',
    category: 'Business',
    description: 'Ace your interviews with expert tips and practice.',
    icon: UserCheck,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an Experienced Technical & HR Interviewer.'
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Generator',
    category: 'Business',
    description: 'Structure startup pitches that captivate investors.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are a VC Investment Analyst.'
  },
  {
    id: 'mindful-mentor',
    title: 'Mindful Mentor',
    category: 'Mental Health',
    description: 'Find clarity and calm with empathetic guidance.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an empathetic Mindful Guide.'
  },
  {
    id: 'mood-booster',
    title: 'Mood Booster',
    category: 'Mental Health',
    description: 'Get uplifting words and positivity when needed.',
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are a Positive Mindset Coach.'
  },
  {
    id: 'code-debugger',
    title: 'Code Debugger',
    category: 'Coding',
    description: 'Fix bugs and optimize code instantly.',
    icon: Code,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are a Senior Software Engineer.'
  },
  {
    id: 'time-planner',
    title: 'Daily Planner',
    category: 'Productivity',
    description: 'Organize tasks and boost your productivity daily.',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&auto=format&fit=crop&q=60',
    systemPrompt: 'You are an Elite Productivity Coach.'
  }
];

export default function AIHelpersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModal, setActiveModal] = useState(null);
  const [promptInput, setPromptInput] = useState('');
  
  // Dynamic Chat History
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Profile State
  const [profile, setProfile] = useState({
    name: 'User',
    email: '',
    gender: '',
    dob: '',
    image: null
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const chatEndRef = useRef(null);
  const [generalSearch, setGeneralSearch] = useState('');

  // Fetch user profile from Supabase & LocalStorage
  useEffect(() => {
    async function fetchUserProfile() {
      // 1. First check LocalStorage for immediate rendering
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            name: parsed.name || 'User',
            email: parsed.email || '',
            gender: parsed.gender || '',
            dob: parsed.dob || '',
            image: parsed.image || null
          });
        } catch (e) {
          console.error('LocalStorage parse error:', e);
        }
      }

      // 2. Fall back to / sync with Supabase profiles table
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setProfile({
              name: data.name || 'User',
              email: data.email || user.email || '',
              gender: data.gender || '',
              dob: data.dob || '',
              image: data.avatar_url || null
            });
          }
        }
      } catch (err) {
        console.error('Supabase profile fetch error:', err);
      }
    }

    fetchUserProfile();
  }, [supabase]);

  // Auto-scroll chat window to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Handle outside click for profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredHelpers = selectedCategory === 'All' 
    ? HELPERS 
    : HELPERS.filter(h => h.category === selectedCategory);

  const categoriesToDisplay = selectedCategory === 'All' 
    ? Array.from(new Set(HELPERS.map(h => h.category))) 
    : [selectedCategory];

  const handleOpenModal = (helper) => {
    setActiveModal(helper);
    setChatMessages([]);
  };

  // Main chat submission handler
  const sendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    // 1. Append user message to history
    const updatedMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(updatedMessages);
    
    // 2. Clear input immediately
    setPromptInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: activeModal?.systemPrompt || 'You are a helpful AI assistant.',
          userMessage: userText,
          history: updatedMessages
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Keep previous responses and add new response
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.result }]);
      } else {
        setChatMessages((prev) => [
          ...prev, 
          { role: 'assistant', content: `Error: ${data.error || 'Failed to generate response'}` }
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: 'An error occurred while connecting to the AI helper.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    sendMessage(promptInput);
  };

  const handleStartGeneralChat = (e) => {
    e.preventDefault();
    if (!generalSearch.trim()) return;

    const generalHelper = {
      id: 'general-chat',
      title: 'General AI Assistant',
      category: 'Chat & Search',
      systemPrompt: 'You are a knowledgeable and versatile AI assistant.'
    };

    setActiveModal(generalHelper);
    const initialQuery = generalSearch;
    
    // Clear search bar
    setGeneralSearch('');
    
    // Initialize message log
    setChatMessages([{ role: 'user', content: initialQuery }]);
    
    // Fetch initial AI response
    setTimeout(() => {
      sendMessage(initialQuery);
    }, 100);
  };

  const closeModal = () => {
    setActiveModal(null);
    setPromptInput('');
    setChatMessages([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user_profile');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 font-sans antialiased">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI Helpers
            </h1>
          </div>

          {/* Dynamic Profile Dropdown Header */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition focus:outline-none"
            >
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  className="w-9 h-9 rounded-full object-cover border border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                {profile.name}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Profile Menu Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  {profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-11 h-11 rounded-full object-cover border border-indigo-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-lg">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-900 truncate">{profile.name}</p>
                    <p className="text-xs text-slate-500 truncate">{profile.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="py-3 space-y-2 text-xs text-slate-600 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Gender:</span>
                    <span className="font-medium text-slate-700">{profile.gender || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date of Birth:</span>
                    <span className="font-medium text-slate-700">{profile.dob || 'Not set'}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 p-2.5 rounded-xl text-xs font-semibold transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-8 pb-16">
        
        {/* NEW CHAT / GENERAL SEARCH BAR */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-2xl shadow-sm">
          <div className="bg-white rounded-[15px] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hidden sm:block">
              <Bot className="w-6 h-6" />
            </div>
            <form onSubmit={handleStartGeneralChat} className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ask anything or search for general data..."
                  value={generalSearch}
                  onChange={(e) => setGeneralSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 shrink-0 transition shadow-sm"
              >
                <span>New Chat</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* HELPER CATEGORY SECTIONS */}
        <div className="space-y-10">
          {categoriesToDisplay.map((catName) => {
            const groupHelpers = filteredHelpers.filter(h => h.category === catName);
            if (groupHelpers.length === 0) return null;

            return (
              <div key={catName} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {catName === 'Writing' ? 'Writing Skills' : catName === 'Business' ? 'Business Helper' : catName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                  {groupHelpers.map((helper) => {
                    const Icon = helper.icon;
                    return (
                      <div
                        key={helper.id}
                        onClick={() => handleOpenModal(helper)}
                        className="bg-white border border-slate-100 rounded-3xl p-5 flex items-start space-x-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition duration-200 cursor-pointer group"
                      >
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                          {helper.image ? (
                            <img 
                              src={helper.image} 
                              alt={helper.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                              <Icon className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition truncate">
                            {helper.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-snug">
                            {helper.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* CONTINUOUS AI CHAT WORKSPACE MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  {activeModal.icon ? <activeModal.icon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{activeModal.title}</h3>
                  <p className="text-xs text-slate-500">{activeModal.category} Assistant</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Workspace */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
                  <p className="text-sm font-medium text-slate-600">What would you like to build or generate?</p>
                  <p className="text-xs text-slate-400">Type your request below to begin.</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Response</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-4 text-sm flex items-center space-x-2 border border-slate-200/50">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar Form */}
            <form onSubmit={handleModalSubmit} className="p-4 border-t border-slate-100 bg-white flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Ask ${activeModal.title}...`}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={isLoading || !promptInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center justify-center transition shadow-sm"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}