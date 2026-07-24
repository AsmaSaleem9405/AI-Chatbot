import React from 'react';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  Archive, 
  HelpCircle, 
  FileText, 
  Lock, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

const settingsSections = [
  {
    title: 'Account',
    items: [
      { name: 'Personal info', icon: User, href: '/dashboard/personal-info' },
      { name: 'Data controls', icon: ShieldCheck, href: '/dashboard/data-controls' },
      { name: 'Archived chats', icon: Archive, href: '/dashboard/settings/archived-chats' },
    ],
  },
  {
    title: 'About',
    items: [
      { name: 'Help center', icon: HelpCircle, href: '/dashboard/help' },
      { name: 'Terms of Use', icon: FileText, href: '/dashboard/terms' },
      { name: 'Privacy Policy', icon: Lock, href: '/dashboard/privacy' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-sky-100 text-zinc-950 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Main Container - Full screen width utilization with comfortable padding and scroll enabled */}
      <main className="w-full px-6 sm:px-12 py-10 flex-grow pb-28 transition-all duration-500">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            Settings
          </h1>
        </div>

        {/* Sections */}
        <div className="space-y-8 max-w-3xl">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-xs font-medium uppercase tracking-wider text-blue-600/80">
                {section.title}
              </h2>
              
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={itemIdx}
                      href={item.href}
                      className="flex items-center justify-between py-3.5 px-4 bg-white/40 hover:bg-white/80 backdrop-blur-md rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 border border-transparent hover:border-blue-100 group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="text-blue-600 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <span className="text-sm sm:text-base font-medium text-zinc-800">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="pt-2 pb-6 max-w-3xl">
            <div className="space-y-1">
              <a
                href="/login"
                className="flex items-center justify-between py-3.5 px-4 bg-white/40 hover:bg-red-50/80 backdrop-blur-md rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5 border border-transparent hover:border-red-100 group text-zinc-800"
              >
                <div className="flex items-center space-x-3.5">
                  <LogOut className="w-5 h-5 stroke-[1.75] text-zinc-600 group-hover:text-red-600 transition-colors group-hover:scale-110 duration-300" />
                  <span className="text-sm sm:text-base font-medium group-hover:text-red-600 transition-colors">Logout</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}