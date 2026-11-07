import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Step 1: Identifying discipline, academic field, and scope...',
  'Step 2: Narrowing topic into focused, testable research question...',
  'Step 3: Extracting 4–6 core variables and conceptual definitions...',
  'Step 4: Structuring literature themes and Scholar/arXiv search queries...',
  'Step 5: Formulating and justifying empirical methodology...',
  'Step 6: Drafting academic abstract (150–200 words)...',
  'Step 7: Validating limitations, ethical considerations, and citation integrity...',
];

export const LoadingIndicator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-8 sm:p-10 text-center max-w-2xl mx-auto my-6">
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        Research Paper Agent is reasoning...
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-6">
        Executing step-by-step academic synthesis via Gemini AI
      </p>

      <div className="space-y-2.5 max-w-md mx-auto text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs sm:text-sm transition-all duration-300 ${
                isCurrent
                  ? 'text-indigo-700 font-semibold translate-x-1'
                  : isDone
                  ? 'text-slate-400 font-normal line-through'
                  : 'text-slate-300 font-normal opacity-50'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
