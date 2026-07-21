'use client';
import Image from "next/image";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { 
  Pencil, GraduationCap, Music, BookOpen, Mail, UserCheck, 
  Heart, ArrowLeft, Send, Sparkles, X, Loader2, 
  Code, Briefcase, Bot, Search, LogOut, ChevronDown,
  Stethoscope, Share2, Dumbbell,
  FileText, Cpu
} from 'lucide-react';

const CATEGORIES = [
  'All', 
  'Writing', 
  'Business', 
  'Medical & Health', 
  'Coding & Tech', 
  'Productivity', 
  'Marketing'
];

const HELPERS = [
  // --- WRITING (4) ---
  {
    id: 'essay-writer',
    title: 'Essay Writer',
    category: 'Writing',
    description: 'Craft compelling essays effortlessly.',
    icon: Pencil,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an expert Essay Writer. Help the user draft, outline, and refine well-structured essays.',
    suggestions: [
      { title: 'Why does the earth rotate?', desc: 'Discover the science behind Earth\'s motion.' },
      { title: 'Write me a recommendation letter', desc: 'Get a professional and persuasive letter instantly.' }
    ]
  },
  {
    id: 'academic-writer',
    title: 'Academic Writer',
    category: 'Writing',
    description: 'Get structured, research-backed academic content.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an Academic Writing Specialist. Provide scholarly, well-formatted content.',
    suggestions: [
      { title: 'Outline a research paper', desc: 'Structure key sections for academic submission.' },
      { title: 'Summarize a study', desc: 'Extract key methodologies and key conclusions.' }
    ]
  },
  {
    id: 'lyrics-songs',
    title: 'Lyrics & Songs',
    category: 'Writing',
    description: 'Turn your ideas into catchy and meaningful lyrics.',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a creative Songwriter and Lyricist.',
    suggestions: [
      { title: 'Write an acoustic chorus', desc: 'Emotional and catchy chorus for acoustic guitar.' },
      { title: 'Rhyme scheme ideas', desc: 'Generate fresh lyrics around love or life.' }
    ]
  },
  {
    id: 'storyteller',
    title: 'Storyteller',
    category: 'Writing',
    description: 'Create engaging and immersive stories in seconds.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a Master Storyteller.',
    suggestions: [
      { title: 'Sci-Fi Plot Twist', desc: 'Brainstorm a mind-bending story conclusion.' },
      { title: 'Character Backstory', desc: 'Build a deep and complex hero biography.' }
    ]
  },

  // --- BUSINESS (3) ---
  {
    id: 'email-creator',
    title: 'Email Creator',
    category: 'Business',
    description: 'Write professional and polished emails instantly.',
    icon: Mail,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an Executive Communication Expert.',
    suggestions: [
      { title: 'Ask for a salary raise', desc: 'Polite and convincing email to your manager.' },
      { title: 'Cold outreach email', desc: 'Engaging email pitch for potential clients.' }
    ]
  },
  {
    id: 'interview-coach',
    title: 'Interview Coach',
    category: 'Business',
    description: 'Ace your interviews with expert tips and mock practice.',
    icon: UserCheck,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an Experienced Technical & HR Interviewer.',
    suggestions: [
      { title: 'Mock HR Questions', desc: 'Practice answering "Tell me about yourself".' },
      { title: 'STAR Method tips', desc: 'Structure your behavioral answers smoothly.' }
    ]
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Generator',
    category: 'Business',
    description: 'Structure startup pitches that captivate investors.',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a VC Investment Analyst.',
    suggestions: [
      { title: 'Problem & Solution slide', desc: 'Craft a compelling vision statement.' },
      { title: 'Monetization Strategy', desc: 'Outline business models clearly for VC funding.' }
    ]
  },

  // --- MEDICAL & HEALTH (3) ---
  {
    id: 'medical-consultant',
    title: 'Medical Assistant',
    category: 'Medical & Health',
    description: 'Understand medical terms, symptoms, and health advice.',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an informative AI Medical Assistant.',
    suggestions: [
      { title: 'Explain blood test terms', desc: 'Understand normal ranges and terminology.' },
      { title: 'Healthy sleep habits', desc: 'Tips for improving circadian rhythms.' }
    ]
  },
  {
    id: 'fitness-coach',
    title: 'Workout Coach',
    category: 'Medical & Health',
    description: 'Get custom workout routines and fitness advice.',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a certified Personal Trainer.',
    suggestions: [
      { title: '30-minute HIIT routine', desc: 'No-equipment bodyweight workout plan.' },
      { title: 'High-protein diet ideas', desc: 'Easy meal ideas to support muscle recovery.' }
    ]
  },
  {
    id: 'mindful-mentor',
    title: 'Mindful Mentor',
    category: 'Medical & Health',
    description: 'Find clarity and calm with empathetic guidance.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an empathetic Mindful Guide.',
    suggestions: [
      { title: '5-minute breathing exercise', desc: 'Reduce anxiety and reset your mind.' },
      { title: 'Daily journaling prompts', desc: 'Reflect on gratitude and focus.' }
    ]
  },

  // --- CODING & TECH (2) ---
  {
    id: 'code-debugger',
    title: 'Code Debugger',
    category: 'Coding & Tech',
    description: 'Fix bugs and optimize code across any programming language.',
    icon: Code,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a Senior Software Engineer.',
    suggestions: [
      { title: 'Fix React render loop', desc: 'Identify and fix infinite state updates.' },
      { title: 'Optimize SQL query', desc: 'Improve database query response times.' }
    ]
  },
  {
    id: 'tech-architect',
    title: 'System Architect',
    category: 'Coding & Tech',
    description: 'Design database schemas and software systems.',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a Principal Software Architect.',
    suggestions: [
      { title: 'Design user auth schema', desc: 'Relational model for roles & permissions.' },
      { title: 'Microservices vs Monolith', desc: 'Choose the best setup for your product.' }
    ]
  },

  // --- MARKETING (1) ---
  {
    id: 'social-media-strategist',
    title: 'Social Media Manager',
    category: 'Marketing',
    description: 'Generate viral content ideas, captions, and posts.',
    icon: Share2,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are a Social Media Content Strategist.',
    suggestions: [
      { title: 'Instagram Reel strategy', desc: 'Hooks and captions to drive engagement.' },
      { title: 'LinkedIn content calendar', desc: 'Weekly schedule for professional reach.' }
    ]
  },

  // --- PRODUCTIVITY (1) ---
  {
    id: 'resume-builder',
    title: 'Resume & CV Builder',
    category: 'Productivity',
    description: 'Craft ATS-friendly resumes tailored to your target job.',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=80',
    systemPrompt: 'You are an Executive Resume Writer.',
    suggestions: [
      { title: 'Action verbs for bullet points', desc: 'Make achievements stand out on paper.' },
      { title: 'Target resume to job post', desc: 'Match keywords for ATS filters.' }
    ]
  }
];

export default function AIHelpersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModal, setActiveModal] = useState(null);
  const [promptInput, setPromptInput] = useState('');
  
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    async function fetchUserProfile() {
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

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

  const sendMessage = async (userText, currentHistory = chatMessages, customSystemPrompt = null) => {
    if (!userText.trim() || isLoading) return;

    const updatedMessages = [...currentHistory, { role: 'user', content: userText }];
    setChatMessages(updatedMessages);
    
    setPromptInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: customSystemPrompt || activeModal?.systemPrompt || 'You are a helpful AI assistant.',
          userMessage: userText,
          history: updatedMessages
        }),
      });

      const data = await res.json();
      if (res.ok) {
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
      title: 'New Chat',
      category: 'General Assistant',
      description: 'Ask questions or explore ideas with a versatile AI.',
      icon: Bot,
      image: '',
      systemPrompt: 'You are a knowledgeable AI assistant. Keep full conversation history and remember previous context.'
    };

    const initialQuery = generalSearch;
    setGeneralSearch('');
    
    setActiveModal(generalHelper);
    sendMessage(initialQuery, [], generalHelper.systemPrompt);
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
    
    <div className="w-full h-screen overflow-y-auto bg-[#f8f9fc] text-slate-900 font-sans antialiased relative">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center space-x-3 h-full">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <a
              href="/dashboard/ai-helpers"
              className="relative flex items-center h-8 cursor-pointer"
            >
              <Image
                src="/images/nexora.png"
                alt="Nexora AI Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </a>
          </div>

          {/* Profile */}
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
                  {profile.name
                    ? profile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}

              <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                {profile.name}
              </span>

              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-8 pb-32">
        
        {/* NEW CHAT / SEARCH BAR */}
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
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
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
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{catName}</span>
                  <span className="text-xs font-normal text-slate-400">({groupHelpers.length})</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {groupHelpers.map((helper) => {
                    const Icon = helper.icon;
                    return (
                      <div
                        key={helper.id}
                        onClick={() => handleOpenModal(helper)}
                        className="bg-white border border-slate-100 rounded-3xl p-5 flex items-start space-x-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition duration-200 cursor-pointer group"
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-indigo-50 flex items-center justify-center">
                          {helper.image && (
                            <img 
                              src={helper.image} 
                              alt={helper.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300 relative z-10"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <Icon className="w-8 h-8 text-indigo-600 absolute" />
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

      {/* FULL-SCREEN CHAT INTERFACE (MOBILE & LAPTOP RESPONSIVE) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col h-full w-full">
          
          {/* Top Bar Header with Logo */}
          <div className="px-4 py-3 sm:px-8 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 max-w-5xl mx-auto w-full">
            <div className="flex items-center space-x-3">
              <button 
                onClick={closeModal}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-800 transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-3">
                <a href="/dashboard/ai-helpers" className="flex items-center shrink-0">
                  <Image
                    src="/images/nexora.png"
                    alt="Nexora AI Logo"
                    width={100}
                    height={32}
                    className="object-contain"
                  />
                </a>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                  {activeModal.title}
                </h2>
              </div>
            </div>
            
            <button 
              onClick={closeModal}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition hidden sm:block"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 flex flex-col justify-between">
            
            <div className="space-y-4 flex-1">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col justify-end pb-4">
                  {/* Suggestion Cards Container */}
                  {activeModal.suggestions && activeModal.suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {activeModal.suggestions.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(item.title)}
                          className="p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 rounded-2xl text-left transition group"
                        >
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 mb-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => sendMessage('Why does the earth rotate?')}
                        className="p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 rounded-2xl text-left transition group"
                      >
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 mb-1">
                          Why does the earth rotate?
                        </p>
                        <p className="text-xs text-slate-400">
                          Discover the science behind Earth's motion.
                        </p>
                      </button>

                      <button
                        onClick={() => sendMessage('Write me a recommendation letter')}
                        className="p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 rounded-2xl text-left transition group"
                      >
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 mb-1">
                          Write me a recommendation letter
                        </p>
                        <p className="text-xs text-slate-400">
                          Get a professional and persuasive letter instantly.
                        </p>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Assistant</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

          </div>

          {/* Bottom Fixed Input Box */}
          <div className="w-full bg-white border-t border-slate-100 p-3 sm:p-4 shrink-0">
            <form onSubmit={handleModalSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200/80 rounded-full px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !promptInput.trim()}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition shadow-md shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 translate-x-0.5" />
                )}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}