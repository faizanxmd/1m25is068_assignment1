import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BrainCircuit, CheckCircle2, Copy, Check } from 'lucide-react';

interface ReasoningPanelProps {
  reasoning: string;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ reasoning }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reasoning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 rounded-2xl shadow-md overflow-hidden border border-slate-800 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-white tracking-tight">
                Agent Reasoning
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Step-by-step
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-lg mt-0.5">
              {isOpen ? 'Internal formulation and scope narrowing steps' : reasoning}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Copy reasoning text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
          <span className="p-1 rounded-md text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40">
          <div className="space-y-4">
            <div className="text-sm leading-relaxed text-slate-300 font-normal whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono-code text-xs sm:text-sm">
              {reasoning}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>1. Field & Scope</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2. Focused RQ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3. Key Variables</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4. Lit Themes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
