import React from 'react';
import { AlertTriangle, ShieldCheck, CheckSquare } from 'lucide-react';

interface LimitationsCardProps {
  limitations: string[];
  verifyNote: string;
}

export const LimitationsCard: React.FC<LimitationsCardProps> = ({
  limitations,
  verifyNote,
}) => {
  return (
    <div className="space-y-4">
      {/* Limitations Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-medium">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Limitations & Ethical Considerations
            </h3>
            <span className="text-xs text-slate-400">Methodological threats & open questions</span>
          </div>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3 pt-1">
          {limitations.map((lim, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-xs sm:text-sm"
            >
              <CheckSquare className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Citation Integrity Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 shadow-xs flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-emerald-950">
              Citation Verification Policy
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200/80 text-emerald-800 uppercase">
              Zero Hallucinations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-900/90 mt-1 leading-relaxed">
            {verifyNote || 'No specific papers cited; use the provided search queries to locate peer-reviewed sources on Google Scholar and arXiv.'}
          </p>
        </div>
      </div>
    </div>
  );
};
