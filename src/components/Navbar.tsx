import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, History } from 'lucide-react';

interface NavbarProps {
  onOpenHistory?: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, savedCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-indigo-500/20">
            <BookOpen className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-lg tracking-tight">
                Research Paper Agent
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Structured literature outlines, search queries & methodology planner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Citation Integrity Verified</span>
          </div>

          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
              title="View previous research briefs"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span>History</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-semibold">
                  {savedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
