import React, { useState } from 'react';
import { Download, FileJson, FileText, FileCode, Copy, Check } from 'lucide-react';
import type { ResearchBrief } from '../types';
import { briefToPlainText, briefToMarkdown, downloadFile } from '../utils/exportBrief';

interface ExportToolbarProps {
  brief: ResearchBrief;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({ brief }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const safeTopicSlug = brief.topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 32);
  const baseFilename = `research-brief-${safeTopicSlug || 'paper'}`;

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(brief, null, 2);
    downloadFile(jsonStr, `${baseFilename}.json`, 'application/json');
  };

  const handleDownloadText = () => {
    const textContent = briefToPlainText(brief);
    downloadFile(textContent, `${baseFilename}.txt`, 'text/plain');
  };

  const handleDownloadMarkdown = () => {
    const mdContent = briefToMarkdown(brief);
    downloadFile(mdContent, `${baseFilename}.md`, 'text/markdown');
  };

  const handleCopyAll = () => {
    const textContent = briefToPlainText(brief);
    navigator.clipboard.writeText(textContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 self-start md:self-center">
        <Download className="w-4 h-4 text-slate-500" />
        <span className="text-xs sm:text-sm font-semibold text-slate-700">
          Export Structured Brief
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Copy full brief */}
        <button
          type="button"
          onClick={handleCopyAll}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {copiedAll ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Copy Full Brief</span>
            </>
          )}
        </button>

        {/* Download JSON */}
        <button
          type="button"
          onClick={handleDownloadJSON}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
        >
          <FileJson className="w-3.5 h-3.5 text-indigo-600" />
          <span>Download JSON</span>
        </button>

        {/* Download as text */}
        <button
          type="button"
          onClick={handleDownloadText}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>Download as text</span>
        </button>

        {/* Download Markdown */}
        <button
          type="button"
          onClick={handleDownloadMarkdown}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Download as GitHub-flavored Markdown"
        >
          <FileCode className="w-3.5 h-3.5 text-slate-600" />
          <span>Markdown (.md)</span>
        </button>
      </div>
    </div>
  );
};
