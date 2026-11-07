import React, { useState } from 'react';
import { Library, ExternalLink, Search, Copy, Check, FileSearch } from 'lucide-react';
import type { LiteratureTheme } from '../types';

interface LiteratureThemesCardProps {
  themes: LiteratureTheme[];
}

export const LiteratureThemesCard: React.FC<LiteratureThemesCardProps> = ({ themes }) => {
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(query);
    setTimeout(() => setCopiedQuery(null), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-medium">
            <Library className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Literature Review Themes & Search Queries
            </h3>
            <span className="text-xs text-slate-400">
              Verified queries to discover real peer-reviewed literature
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
          <FileSearch className="w-3.5 h-3.5 text-slate-400" />
          <span>Click query to search databases directly</span>
        </div>
      </div>

      <div className="space-y-5">
        {themes.map((item, themeIdx) => (
          <div
            key={themeIdx}
            className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold">
                {themeIdx + 1}
              </span>
              <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                {item.theme}
              </h4>
            </div>

            <div className="space-y-2 pt-1 pl-1 sm:pl-7">
              {item.search_queries.map((query, queryIdx) => {
                const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
                const arxivUrl = `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`;
                const isCopied = copiedQuery === query;

                return (
                  <div
                    key={queryIdx}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-all text-xs sm:text-sm group"
                  >
                    <div className="flex items-start sm:items-center gap-2 font-mono-code text-slate-800 break-words">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="font-medium text-slate-800 select-all">"{query}"</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-1 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(query)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        title="Copy search query"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <a
                        href={scholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200 transition-colors"
                      >
                        <span>Google Scholar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={arxivUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                      >
                        <span>arXiv</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
