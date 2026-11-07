import React, { useState } from 'react';
import { Search, FileText, ArrowRight, Loader2, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

interface TopicFormProps {
  onGenerate: (topic: string, existingText: string) => void;
  isLoading: boolean;
  initialTopic?: string;
  initialExistingText?: string;
}

const SAMPLE_TOPICS = [
  {
    title: 'Teenagers & Social Media Sleep',
    topic: 'Effect of social media on sleep in teenagers',
    text: '',
  },
  {
    title: 'Vision Transformers for Crop Disease',
    topic: 'Using transformers for crop disease detection',
    text: '',
  },
  {
    title: 'Microplastics in Freshwater Food Webs',
    topic: 'Bioaccumulation of microplastics and trophic transfer in freshwater fish species',
    text: '',
  },
  {
    title: 'AI in Clinical Triage Ethics',
    topic: 'Ethical governance and bias mitigation in algorithmic emergency department triage systems',
    text: '',
  },
];

export const TopicForm: React.FC<TopicFormProps> = ({
  onGenerate,
  isLoading,
  initialTopic = '',
  initialExistingText = '',
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [existingText, setExistingText] = useState(initialExistingText);
  const [showContextField, setShowContextField] = useState(Boolean(initialExistingText));

  // Sync if initial props change
  React.useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialExistingText) {
      setExistingText(initialExistingText);
      setShowContextField(true);
    }
  }, [initialTopic, initialExistingText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onGenerate(topic.trim(), existingText.trim());
  };

  const handleSelectSample = (sampleTopic: string, sampleText: string) => {
    setTopic(sampleTopic);
    setExistingText(sampleText);
    if (sampleText) setShowContextField(true);
  };

  const handleClear = () => {
    setTopic('');
    setExistingText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-800">
              Research Topic or Question <span className="text-rose-500">*</span>
            </label>
            {topic && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="topic-input"
              type="text"
              required
              disabled={isLoading}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Effect of social media on sleep in teenagers"
              className="block w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm sm:text-base font-normal shadow-xs transition"
            />
          </div>
        </div>

        {/* Optional Context / Abstract Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowContextField(!showContextField)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showContextField ? 'Hide optional context / abstract' : '+ Add optional draft abstract, notes, or paper text'}</span>
            {showContextField ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showContextField && (
            <div className="mt-2.5">
              <label htmlFor="context-input" className="block text-xs font-medium text-slate-600 mb-1">
                Existing abstract, draft excerpts, or specific constraints (Optional)
              </label>
              <textarea
                id="context-input"
                rows={4}
                disabled={isLoading}
                value={existingText}
                onChange={(e) => setExistingText(e.target.value)}
                placeholder="Paste an existing abstract, raw findings, specific target population, or methodology preferences you want the agent to incorporate..."
                className="block w-full p-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs sm:text-sm shadow-xs transition"
              />
            </div>
          )}
        </div>

        {/* Quick Sample Topics */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Try sample academic topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(item.topic, item.text)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 text-slate-700 transition font-medium text-left"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm transition ${
              !topic.trim() || isLoading
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] ring-2 ring-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Formulating research brief...</span>
              </>
            ) : (
              <>
                <span>Generate brief</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
