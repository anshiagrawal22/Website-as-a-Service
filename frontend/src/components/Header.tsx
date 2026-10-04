import React, { useState, useRef, useEffect } from 'react';
import { Settings, HelpCircle, ChevronDown, User, Sparkles, ShieldCheck, LogOut } from 'lucide-react';
import { api } from '../services/api.ts';

interface HeaderProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  onOpenSettings,
  onOpenHelp,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState('Dimple');
  const [userFullName, setUserFullName] = useState('Dimple Lulla');
  const [userEmail, setUserEmail] = useState('dimplelulla2004@gmail.com');
  const [userPlan, setUserPlan] = useState('Studio Pro Plan');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await api.getMe();
        if (user) {
          setUserFullName(user.name);
          setUserName(user.name.split(' ')[0] || user.name);
          setUserEmail(user.email);
          if (user.plan) setUserPlan(user.plan);
        }
      } catch (err) {
        // Fallback to initial Dimple profile
      }
    }
    loadUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DCE0F5] bg-[#FFFFFF]/90 backdrop-blur-md shadow-2xs transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: LOGO */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectNav('Home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418]"
            title="Website as a Service Builder"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#AF4418] text-[#FFFFFF] shadow-sm transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1E1C24] transition-colors group-hover:text-[#AF4418]">
              Website as a Service
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links: Home, Websites, Templates, Pricing, Manage Info */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {(['Home', 'Websites', 'Templates', 'Pricing', 'Manage Info'] as const).map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => onSelectNav(item)}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418] rounded-lg ${
                  isActive
                    ? 'text-[#AF4418] font-bold'
                    : 'text-[#646074] hover:text-[#1E1C24] hover:bg-[#F2F3FB]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#AF4418]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions: Settings (⚙), Help (?), Dimple ▾ */}
        <div className="flex items-center gap-2">
          {/* Settings icon */}
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#646074] transition-colors hover:bg-[#F2F3FB] hover:text-[#AF4418] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418]"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Help icon */}
          <button
            onClick={onOpenHelp}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#646074] transition-colors hover:bg-[#F2F3FB] hover:text-[#AF4418] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418]"
            title="Help & Guides"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Dimple ▾ User Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-[#DCE0F5] bg-[#FFFFFF] px-2.5 py-1.5 text-sm font-medium text-[#1E1C24] transition-all hover:bg-[#F2F3FB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418]"
              aria-expanded={profileOpen}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCEEE8] text-xs font-bold text-[#AF4418] border border-[#F3D5C8]">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{userName}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#646074] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#DCE0F5] bg-[#FFFFFF] p-1.5 shadow-xl shadow-black/5 ring-1 ring-black/5 z-50 animate-fadeIn">
                <div className="px-3 py-2.5 border-b border-[#DCE0F5] mb-1">
                  <p className="text-xs font-medium text-[#646074]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#1E1C24] truncate">{userFullName}</p>
                  <p className="text-xs text-[#646074] truncate">{userEmail}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#AF4418] bg-[#FCEEE8] border border-[#F3D5C8] px-2 py-0.5 rounded-md">
                      {userPlan}
                    </span>
                    <span className="text-[11px] text-[#646074]">Active Cloud Sync</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs text-[#1E1C24]">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenSettings();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-[#646074]" />
                    <span>Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenSettings();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#646074]" />
                    <span>Domains & Security</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenHelp();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-[#F2F3FB] hover:text-[#AF4418] transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#646074]" />
                    <span>What's New in Platform</span>
                  </button>
                </div>

                <div className="border-t border-[#DCE0F5] mt-1 pt-1">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
