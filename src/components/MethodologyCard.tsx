import React, { useState } from 'react';
import { Compass, Copy, Check, CheckCircle2 } from 'lucide-react';

interface MethodologyCardProps {
  methodology: string;
}

export const MethodologyCard: React.FC<MethodologyCardProps> = ({ methodology }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(methodology);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine method type badge if possible
  const getMethodologyType = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('experimental')) return 'Experimental / Quantitative';
    if (lower.includes('survey') || lower.includes('cross-sectional')) return 'Survey / Cross-Sectional';
    if (lower.includes('systematic review') || lower.includes('meta-analysis')) return 'Systematic Review / Meta-Analysis';
    if (lower.includes('mixed')) return 'Mixed Methods';
    if (lower.includes('qualitative') || lower.includes('ethnograph') || lower.includes('interview')) return 'Qualitative Analysis';
    return 'Research Design';
  };

  const methodType = getMethodologyType(methodology);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-medium">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Suggested Methodology
            </h3>
            <span className="text-xs text-slate-400">Study design & empirical rationale</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {methodType}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Copy methodology"
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
      </div>

      <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80">
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {methodology}
        </p>
      </div>
    </div>
  );
};
