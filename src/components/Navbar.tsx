import React from 'react';
import { UserAccount } from '../types/quiz';
import { Terminal, Shield, User } from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'leaderboard' | 'rubric' | 'admin';
  onSelectTab: (tab: 'catalog' | 'leaderboard' | 'rubric' | 'admin') => void;
  currentUser: UserAccount;
  onSwitchUserRole: (role: 'student' | 'admin' | 'instructor') => void;
  isQuizActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchUserRole,
  isQuizActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Terminal className="w-5 h-5" />
          </div>
          <button
            onClick={() => !isQuizActive && onSelectTab('catalog')}
            className="text-left group cursor-pointer focus:outline-none"
            disabled={isQuizActive}
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              JavaMaster
            </span>
            <span className="text-xs text-slate-500 block -mt-1 font-mono">SE 21 / JVM Platform</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, text with active state) */}
        {!isQuizActive ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                currentTab === 'catalog' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
              }`}
            >
              Quiz Catalog
            </button>
            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                currentTab === 'leaderboard' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
              }`}
            >
              Live Leaderboard
            </button>
            <button
              onClick={() => onSelectTab('rubric')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'rubric' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
              }`}
            >
              <span>Project Rubric & Architecture</span>
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'admin' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Assessment Session in Progress</span>
          </div>
        )}

        {/* Zone 3: Primary Action / User Profile Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative group">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block font-medium text-slate-200 leading-tight">{currentUser.name}</span>
                <span className="block text-[10px] text-slate-500 font-mono capitalize">{currentUser.role} mode</span>
              </div>
            </div>

            {/* Quick role switcher dropdown */}
            {!isQuizActive && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <button
                  onClick={() => onSwitchUserRole('student')}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                    currentUser.role === 'student' ? 'text-amber-400 font-medium' : 'text-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student (Advik)</span>
                </button>
                <button
                  onClick={() => onSwitchUserRole('instructor')}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                    currentUser.role === 'instructor' ? 'text-amber-400 font-medium' : 'text-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Instructor (Alex)</span>
                </button>
                <button
                  onClick={() => onSwitchUserRole('admin')}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                    currentUser.role === 'admin' ? 'text-amber-400 font-medium' : 'text-slate-300'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin (Prof. Vance)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
