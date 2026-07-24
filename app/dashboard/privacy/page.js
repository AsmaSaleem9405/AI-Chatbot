import React from 'react';
import { Shield, Lock, Eye, Database, Cpu, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-sky-100 text-zinc-950 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Main Container - Full width utilization on laptops with clean spacing */}
      <main className="w-full px-6 sm:px-16 lg:px-24 py-12 flex-grow pb-28 animate-fadeIn transition-all duration-500">
        
        {/* Page Header with Floating Animation */}
        <div className="max-w-4xl mb-10 border-b border-blue-200/60 pb-6 transition-all duration-300 animate-slideDown">
          <div className="flex items-center space-x-3 text-blue-600 mb-2 transform transition-transform duration-300 hover:translate-x-1">
            <Shield className="w-6 h-6 stroke-[2] animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">Legal & Trust</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
            Privacy Policy
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
              Welcome to our AI Chatbot web application. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Database className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>1. Information We Collect</h2>
            </div>
            <p>
              We collect information that you provide directly to us when registering, updating your account, or interacting with our AI chatbot:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li className="transition-colors duration-200 hover:text-zinc-900"><strong className="text-zinc-800">Account Information:</strong> Name, email address, and authentication credentials.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900"><strong className="text-zinc-800">Chat Interactions:</strong> The prompts, questions, and text inputs you submit to the AI chatbot, as well as the generated responses.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900"><strong className="text-zinc-800">Usage Data:</strong> Information about how you navigate and interact with our application features.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Cpu className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p>
              We use the information we collect in order to deliver, maintain, and improve our AI chatbot experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600">
              <li className="transition-colors duration-200 hover:text-zinc-900">To provide, operate, and maintain the AI model responses.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">To personalize your chat history and account settings.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">To monitor and analyze trends, usage, and activities to improve user experience.</li>
              <li className="transition-colors duration-200 hover:text-zinc-900">To secure our systems, prevent abuse, and enforce our terms of service.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Lock className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>3. Data Security & Retention</h2>
            </div>
            <p>
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that no method of transmission over the internet is 100% secure. You retain control over your archived chats and can delete your data controls directly through your settings panel.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <UserCheck className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>4. Your Data Rights</h2>
            </div>
            <p>
              Depending on your location, you may have rights regarding your personal information, including the right to access, correct, or delete the personal data we hold about you. You can manage most of your data directly via your account settings or by reaching out to us.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 group p-5 -ml-5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100">
            <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-lg">
              <Mail className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2>5. Contact Us</h2>
            </div>
            <p>
              If you have questions, comments, or concerns about this Privacy Policy or our privacy practices, please contact us through your account help center or support dashboard.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}