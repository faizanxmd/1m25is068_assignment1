import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink } from 'lucide-react';

interface KeyConceptsCardProps {
  concepts: string[];
}

export const KeyConceptsCard: React.FC<KeyConceptsCardProps> = ({ concepts }) => {
  const [copiedConcept, setCopiedConcept] = useState<string | null>(null);

  const handleCopy = (concept: string) => {
    navigator.clipboard.writeText(concept);
    setCopiedConcept(concept);
    setTimeout(() => setCopiedConcept(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-medium">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Key Concepts & Variables
            </h3>
            <span className="text-xs text-slate-400">Core operational definitions</span>
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
          {concepts.length} variables
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {concepts.map((concept, index) => {
          const isCopied = copiedConcept === concept;
          const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(concept)}`;

          return (
            <div
              key={index}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-xs sm:text-sm text-slate-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="font-medium text-slate-700 group-hover:text-indigo-900">
                {concept}
              </span>

              <div className="flex items-center gap-1 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleCopy(concept)}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                  title="Copy concept"
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <a
                  href={scholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                  title="Search on Google Scholar"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
