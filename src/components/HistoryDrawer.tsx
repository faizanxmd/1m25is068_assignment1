import React from 'react';
import { X, Trash2, Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { ResearchBrief } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ResearchBrief[];
  onSelectBrief: (brief: ResearchBrief) => void;
  onClearHistory: () => void;
  activeBriefId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectBrief,
  onClearHistory,
  activeBriefId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Research Briefs History
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {history.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">No saved briefs yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Enter a research topic to generate and save your academic briefs.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const isActive = item.id === activeBriefId;
                const dateStr = item.created_at
                  ? new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recent';

                return (
                  <div
                    key={item.id || item.topic}
                    onClick={() => {
                      onSelectBrief(item);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{dateStr}</span>
                      {isActive && (
                        <span className="text-indigo-600 font-semibold uppercase text-[10px] tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-serif-academic italic">
                      "{item.research_question}"
                    </p>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400">
                        {item.literature_themes.length} themes · {item.key_concepts.length} concepts
                      </span>
                      <span className="text-indigo-600 font-medium inline-flex items-center gap-0.5">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
