import React from 'react';
import { FileText, ShieldAlert, Cpu, UserCheck, RefreshCw, Mail } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-sky-100 text-zinc-950 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Main Container - Full width utilization on laptops with clean spacing */}
      <main className="w-full px-6 sm:px-16 lg:px-24 py-12 flex-grow pb-28 animate-fadeIn transition-all duration-500">
        
        {/* Page Header */}
        <div className="max-w-4xl mb-10 border-b border-blue-200/60 pb-6 transition-all duration-300 animate-slideDown">
          <div className="flex items-center space-x-3 text-blue-600 mb-2 transform transition-transform duration-300 hover:translate-x-1">
            <FileText className="w-6 h-6 stroke-[2] animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">Legal & Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
            Terms of Use
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Last updated: July 23, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="max-w-4xl space-y-10 text-zinc-700 leading-relaxed text-sm sm:text-base">
          
          {/* Introduction */}
          <section className="space-y-3 transition-all duration-300 hover:text-zinc-900">
            <p>
              Welcome to our AI Chatbot web application. By accessing or using our platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <UserCheck className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>1. Use License & Account Responsibilities</h2>
            </div>
            <p>
              You must be at least 13 years old to use this service. When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li className="transition-colors duration-200 hover:text-zinc-900"><strong className="text-zinc-800">Security:</strong> You are responsible for safeguarding your password and account credentials.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">You agree not to share your account access with third parties.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">You must notify us immediately upon becoming aware of any unauthorized use of your security details.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Cpu className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>2. AI Output & Acceptable Use</h2>
            </div>
            <p>
              Our platform utilizes artificial intelligence to generate text responses and content based on your inputs. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li className="transition-colors duration-200 hover:text-zinc-900">AI-generated responses may occasionally be inaccurate, incomplete, or contextually incorrect. You should independently verify important information.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">You will not use the AI chatbot to generate illegal, harmful, threatening, abusive, or harassing content.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">You will not attempt to reverse engineer, decompile, or extract the underlying models or source code of our application.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <ShieldAlert className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>3. Intellectual Property</h2>
            </div>
            <p>
              The service and its original content (excluding user-provided prompts and chats), features, and functionality are and will remain the exclusive property of our web application and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <RefreshCw className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>4. Termination</h2>
            </div>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Use. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Mail className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>5. Changes to Terms</h2>
            </div>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}