import { useState, useEffect } from 'react';
import type { ResearchBrief } from './types';
import { Navbar } from './components/Navbar';
import { TopicForm } from './components/TopicForm';
import { ReasoningPanel } from './components/ReasoningPanel';
import { ResearchQuestionCard } from './components/ResearchQuestionCard';
import { KeyConceptsCard } from './components/KeyConceptsCard';
import { LiteratureThemesCard } from './components/LiteratureThemesCard';
import { MethodologyCard } from './components/MethodologyCard';
import { DraftAbstractCard } from './components/DraftAbstractCard';
import { LimitationsCard } from './components/LimitationsCard';
import { ExportToolbar } from './components/ExportToolbar';
import { LoadingIndicator } from './components/LoadingIndicator';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AlertCircle, RefreshCw, GraduationCap, Sparkles } from 'lucide-react';

const INITIAL_BRIEF: ResearchBrief = {
  id: 'brief-sample-initial',
  created_at: new Date().toISOString(),
  topic: 'Effect of social media on sleep in teenagers',
  reasoning:
    'Step 1 - Understand: Field is public health / developmental psychology. Topic is broad; narrowing to nighttime screen use and objective/subjective sleep duration makes it empirically measurable.\nStep 2 - Narrow: Formulate whether nocturnal social media use is associated with truncated sleep duration in adolescents aged 13-18.\nStep 3 - Concepts: Night-time screen use, sleep duration, sleep quality, fear of missing out (FOMO), blue-light exposure, circadian disruption.\nStep 4 - Literature: Outline themes covering screen time and sleep outcomes, psychological mechanisms (FOMO/hyperarousal), and physiological photic melatonin suppression.\nStep 5 - Method: Cross-sectional survey with validated sleep questionnaires (PSQI); suits measuring associations across a large sample size.\nStep 6 - Draft: Draft a 160-word academic abstract summarizing context, research question, survey design, and implications.\nStep 7 - Check: Note self-reported data limitations, lack of causal inference, and residual confounding.',
  research_question:
    'Is night-time social media use associated with shorter sleep duration among adolescents aged 13-18?',
  key_concepts: [
    'night-time screen use',
    'sleep duration',
    'sleep quality',
    'fear of missing out',
    'blue-light exposure',
    'circadian phase delay',
  ],
  literature_themes: [
    {
      theme: 'Screen time and adolescent sleep outcomes',
      search_queries: [
        'adolescent social media sleep duration',
        'bedtime screen use teenagers sleep quality',
      ],
    },
    {
      theme: 'Psychological mechanisms and cognitive arousal',
      search_queries: [
        'fear of missing out sleep adolescents',
        'social networking bedtime cognitive arousal youth',
      ],
    },
    {
      theme: 'Physiological pathways & blue-light photic disruption',
      search_queries: [
        'smartphone blue light melatonin suppression teenagers',
        'digital media circadian phase delay adolescents',
      ],
    },
  ],
  methodology:
    'Cross-sectional survey with validated sleep questionnaires (e.g., Pittsburgh Sleep Quality Index and Munich ChronoType Questionnaire); suits measuring multivariable associations across a large, representative adolescent cohort.',
  draft_abstract:
    'Adolescent sleep deficiency has emerged as a pervasive public health concern linked to emotional dysregulation, impaired academic achievement, and cardiometabolic vulnerabilities. Concurrently, the ubiquity of mobile smartphones has concentrated adolescent social interaction in the critical pre-sleep window. This investigation examines whether nocturnal social media use is significantly associated with reduced total sleep duration and diminished sleep quality among adolescents aged 13 to 18. Employing a cross-sectional survey design utilizing validated self-report instruments (the Pittsburgh Sleep Quality Index) alongside granular digital media consumption logs, we evaluate associations between screen frequency, nocturnal alert notifications, and sleep parameters. Expected findings demonstrate that late-night social networking correlates with delayed sleep onset latency and reduced overall sleep duration, driven by both psychological stimulation (fear of missing out) and physiological circadian disruption from short-wavelength light emissions. These findings underscore the urgency of integrating digital media hygiene protocols into pediatric sleep recommendations and adolescent wellness policies.',
  limitations: [
    'Self-reported sleep and screen usage data subject to recall bias',
    'Cross-sectional design cannot establish bidirectional causality',
    'Uncontrolled confounding from academic workload and caffeine consumption',
  ],
  verify_note:
    'No specific papers cited; use the verified search queries to discover peer-reviewed literature on Google Scholar and arXiv.',
};

export default function App() {
  const [currentBrief, setCurrentBrief] = useState<ResearchBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ResearchBrief[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initialize history and default brief from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('research_paper_agent_history');
      if (saved) {
        const parsed: ResearchBrief[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentBrief(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
    // Default fallback
    setCurrentBrief(INITIAL_BRIEF);
    setHistory([INITIAL_BRIEF]);
  }, []);

  // Save history to localStorage
  const saveToHistory = (newBrief: ResearchBrief) => {
    setHistory((prev) => {
      // Remove duplicate if exists by id or topic
      const filtered = prev.filter((b) => b.id !== newBrief.id && b.topic.toLowerCase() !== newBrief.topic.toLowerCase());
      const updated = [newBrief, ...filtered].slice(0, 20); // Keep last 20
      try {
        localStorage.setItem('research_paper_agent_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('research_paper_agent_history');
    } catch {
      // ignore
    }
  };

  const handleGenerateBrief = async (topic: string, existingText: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          existingText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      if (!data.brief) {
        throw new Error('No research brief was returned by the agent.');
      }

      setCurrentBrief(data.brief);
      saveToHistory(data.brief);

      // Smooth scroll down to results on mobile/desktop
      setTimeout(() => {
        window.scrollTo({
          top: 360,
          behavior: 'smooth',
        });
      }, 100);
    } catch (err: unknown) {
      console.error('Failed to generate brief:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-950 font-sans">
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={history.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Academic Research Brief Generator</span>
          </div>

          <h1 className="font-serif-academic text-3xl sm:text-5xl font-normal text-slate-950 tracking-tight leading-tight">
            Structure your research with clarity and citation integrity.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Enter any thesis topic or proposal. The agent narrows it into an answerable research question,
            maps operational variables, formulates literature themes with verified search queries,
            and drafts an academic abstract.
          </p>
        </section>

        {/* Input Card Form */}
        <section>
          <TopicForm
            onGenerate={handleGenerateBrief}
            isLoading={isLoading}
            initialTopic={currentBrief?.topic || ''}
            initialExistingText={currentBrief?.existing_text || ''}
          />
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-950">Generation Failed</h4>
              <p className="text-xs sm:text-sm text-rose-800 mt-0.5">{errorMessage}</p>
              {errorMessage.includes('GEMINI_API_KEY') && (
                <p className="text-xs text-rose-700 mt-2 bg-rose-100/70 p-2 rounded-lg font-mono">
                  Tip: Ensure your API key is configured in the AI Studio Settings &gt; Secrets panel.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-900 px-2 py-1 rounded hover:bg-rose-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Step Progress */}
        {isLoading && <LoadingIndicator />}

        {/* Results Section */}
        {!isLoading && currentBrief && (
          <section className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    Structured Research Brief
                  </span>
                  {currentBrief.created_at && (
                    <span className="text-xs text-slate-400">
                      {new Date(currentBrief.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {currentBrief.topic}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleGenerateBrief(
                      currentBrief.topic,
                      currentBrief.existing_text || ''
                    )
                  }
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                  title="Re-run agent on this topic"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Collapsible Agent Reasoning Panel */}
            <ReasoningPanel reasoning={currentBrief.reasoning} />

            {/* Primary Research Question Card */}
            <ResearchQuestionCard question={currentBrief.research_question} />

            {/* Grid: Key Concepts + Methodology */}
            <div className="grid md:grid-cols-2 gap-6">
              <KeyConceptsCard concepts={currentBrief.key_concepts} />
              <MethodologyCard methodology={currentBrief.methodology} />
            </div>

            {/* Literature Review Themes with Google Scholar & arXiv links */}
            <LiteratureThemesCard themes={currentBrief.literature_themes} />

            {/* Draft Abstract Card */}
            <DraftAbstractCard abstractText={currentBrief.draft_abstract} />

            {/* Limitations & Citation Policy */}
            <LimitationsCard
              limitations={currentBrief.limitations}
              verifyNote={currentBrief.verify_note}
            />

            {/* Export Toolbar */}
            <ExportToolbar brief={currentBrief} />
          </section>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectBrief={(brief) => setCurrentBrief(brief)}
        onClearHistory={handleClearHistory}
        activeBriefId={currentBrief?.id}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Research Paper Agent</span>
            <span>·</span>
            <span>Academic Synthesis Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Powered by Google Gemini 3.8
            </span>
            <span>·</span>
            <span>Zero Hallucinated Citations Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
