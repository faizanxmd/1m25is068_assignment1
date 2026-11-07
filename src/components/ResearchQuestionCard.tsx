import React, { useState } from 'react';
import { Target, Copy, Check, Quote } from 'lucide-react';

interface ResearchQuestionCardProps {
  question: string;
}

export const ResearchQuestionCard: React.FC<ResearchQuestionCardProps> = ({ question }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Refined Research Question
            </h3>
            <span className="text-xs text-slate-400">Narrowed & empirically testable</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          title="Copy research question"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative pl-6 pr-2 py-2 border-l-4 border-indigo-600 bg-slate-50/70 rounded-r-xl">
        <Quote className="w-4 h-4 text-indigo-300 absolute -top-1 left-1.5 transform rotate-180 opacity-60" />
        <p className="font-serif-academic text-xl sm:text-2xl font-normal text-slate-900 leading-snug tracking-tight">
          {question}
        </p>
      </div>
    </div>
  );
};
