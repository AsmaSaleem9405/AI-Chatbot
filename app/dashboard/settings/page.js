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
      { name: 'Personal info', icon: User, href: '#' },
      { name: 'Upgrade to Premium', icon: Sparkles, href: '#' },
      { name: 'Data controls', icon: ShieldCheck, href: '#' },
      { name: 'Archived chats', icon: Archive, href: '#' },
    ],
  },
  {
    title: 'About',
    items: [
      { name: 'Help center', icon: HelpCircle, href: '#' },
      { name: 'Terms of Use', icon: FileText, href: '#' },
      { name: 'Privacy Policy', icon: Lock, href: '#' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="h-screen overflow-y-auto bg-white text-zinc-900 flex flex-col">
      {/* Removed max-width restriction so it utilizes full screen width with comfortable padding */}
      <main className="w-full px-6 sm:px-12 py-10 flex-grow pb-28">
        
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
              <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                {section.title}
              </h2>
              
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={itemIdx}
                      href={item.href}
                      className="flex items-center justify-between py-3.5 px-3 hover:bg-zinc-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="text-zinc-700">
                          <Icon className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <span className="text-sm sm:text-base font-normal text-zinc-800">
                          {item.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
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
                href="#"
                className="flex items-center justify-between py-3.5 px-3 hover:bg-red-50 rounded-xl transition-colors group text-zinc-800"
              >
                <div className="flex items-center space-x-3.5">
                  <LogOut className="w-5 h-5 stroke-[1.75] text-zinc-700 group-hover:text-red-600 transition-colors" />
                  <span className="text-sm sm:text-base font-normal group-hover:text-red-600 transition-colors">Logout</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}