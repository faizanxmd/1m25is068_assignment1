import React, { useState } from 'react';
import { FileText, Copy, Check, Info } from 'lucide-react';

interface DraftAbstractCardProps {
  abstractText: string;
}

export const DraftAbstractCard: React.FC<DraftAbstractCardProps> = ({ abstractText }) => {
  const [copied, setCopied] = useState(false);

  const wordCount = abstractText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(abstractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-medium">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Draft Abstract
            </h3>
            <span className="text-xs text-slate-400">Context, methodology, expected findings</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {wordCount} words
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Copy abstract text"
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

      <div className="p-5 sm:p-6 rounded-xl bg-slate-50/60 border border-slate-200/80">
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed text-justify selection:bg-indigo-100">
          {abstractText}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Target length: 150–200 academic words. Ready for manuscript introduction or grant proposal submission.
          </span>
        </div>
      </div>
    </div>
  );
};
