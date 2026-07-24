'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronUp, Search, Send, Loader2 } from 'lucide-react';

const faqData = [
  {
    category: 'Account',
    question: 'Can I edit a generated response?',
    answer: 'Currently, direct editing of AI-generated responses is not supported, but you can copy the text, modify your prompt, and regenerate a new response.'
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by selecting "Forgot password?" on the login screen. Follow the instructions sent to your email to create a new one. If you need further assistance, contact our support team.'
  },
  {
    category: 'Account',
    question: 'How can I delete my history?',
    answer: 'You can clear or delete your archived chats and history at any time from your account settings menu.'
  },
  {
    category: 'Account',
    question: 'Are my data secure?',
    answer: 'Yes, we implement strict security and encryption protocols to protect your chats and personal information. Read our Privacy Policy for more details.'
  },
  {
    category: 'Prompting',
    question: 'How do I get better AI responses?',
    answer: 'Be specific, provide context, and break down complex tasks into smaller step-by-step prompts for optimal results.'
  },
  {
    category: 'Billing',
    question: 'How do I upgrade to Premium?',
    answer: 'Navigate to Settings > Upgrade to Premium to explore our plans and unlock advanced AI features.'
  }
];

const categories = ['All', 'Account', 'Billing', 'Prompting'];

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState('FAQ');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Form States for Real-Time Email Delivery
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, message: messageInput }),
      });

      if (response.ok) {
        alert('Your issue has been sent! You will receive the email notification instantly.');
        setEmailInput('');
        setMessageInput('');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter FAQs based on selected category and search input
  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      <main className="w-full px-6 sm:px-12 py-10 flex-grow pb-28 animate-fadeIn">
        
        {/* Header Title */}
        <div className="mb-6 transform transition-all duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
            Help Center
          </h1>
        </div>

        {/* Top Navigation Tabs (FAQ / Contact) */}
        <div className="flex border-b border-zinc-200/80 mb-8 max-w-3xl">
          <button
            onClick={() => setActiveTab('FAQ')}
            className={`flex-1 pb-3 text-sm sm:text-base font-medium text-center transition-all duration-300 relative ${
              activeTab === 'FAQ' ? 'text-indigo-600 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            FAQ
            {activeTab === 'FAQ' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full shadow-sm shadow-indigo-200 animate-slideUp" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('Contact')}
            className={`flex-1 pb-3 text-sm sm:text-base font-medium text-center transition-all duration-300 relative ${
              activeTab === 'Contact' ? 'text-indigo-600 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Contact
            {activeTab === 'Contact' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full shadow-sm shadow-indigo-200 animate-slideUp" />
            )}
          </button>
        </div>

        {/* Tab Content: FAQ */}
        {activeTab === 'FAQ' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            
            {/* Search Bar */}
            <div className="relative group">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-600" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-zinc-200/80 rounded-2xl text-sm text-zinc-900 shadow-sm shadow-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="space-y-3 pt-2">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`bg-white/80 backdrop-blur-sm border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${
                        isOpen ? 'border-indigo-500/40 shadow-indigo-500/5' : 'border-zinc-200/70 hover:border-zinc-300'
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-medium text-zinc-800 hover:bg-zinc-50/50 transition-colors"
                      >
                        <span className="text-sm sm:text-base">{faq.question}</span>
                        <div className={`p-1 rounded-full transition-transform duration-300 ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-zinc-400'}`}>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-zinc-400 py-10 text-sm animate-fadeIn">No FAQs found matching your query.</p>
              )}
            </div>

          </div>
        )}

        {/* Tab Content: Contact */}
        {activeTab === 'Contact' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm shadow-zinc-100">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-zinc-900">Get in touch with support</h2>
                <p className="text-sm text-zinc-500">
                  Fill out the form below or drop us an email, and our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Your Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Describe your issue or feedback..."
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all duration-300 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:bg-indigo-400 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}