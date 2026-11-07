# Assignment 1: Research Paper Agent (vibe coded with Google AI Studio)

## Assignment
Develop a vibe coded app using Google AI Studio and store the files in GitHub. The app was created from the AI Studio **Build** tab by describing a full-stack web app in natural language. The prompt asks for a "Research Paper Agent" that turns a research topic into a structured research brief.

AI Studio app (opens only for the owner's Google account): https://aistudio.google.com/apps/514bff6d-97df-4f8d-a8fb-4d012bf7413d

## Prompting technique
The build prompt (see `prompt.txt`) combines two techniques:

- **Few-shot prompting**: two worked examples (social media and teenage sleep; transformers for crop disease detection) show the exact JSON output format the agent must return.
- **Chain-of-thought prompting**: the agent system prompt tells the model to think step by step through seven explicit steps (Understand, Narrow, Concepts, Literature, Method, Draft, Check) and to show a short "reasoning" section first.

The prompt also enforces a citation-integrity rule: the agent never invents papers, authors or DOIs and gives Google Scholar / arXiv search queries instead.

## What the app does
Enter a research topic (optionally paste an abstract or notes) and click **Generate brief**. The app shows a refined research question, key concepts, literature themes with Google Scholar and arXiv links, a methodology, a draft abstract, limitations, and a collapsible "Agent reasoning" panel. Results can be downloaded as JSON, plain text or Markdown. The Gemini API key stays on the server (`server.ts`).

## How to run
1. Install Node.js 20 or newer.
2. `npm install`
3. Create a file named `.env.local` and set `GEMINI_API_KEY=your_key_here` (copy `.env.example` for reference; get a free key at https://aistudio.google.com/api-keys). Do not commit this file.
4. `npm run dev`
5. Open http://localhost:3000

## Files
- `prompt.txt`: the few-shot plus chain-of-thought prompt used in AI Studio Build
- `metadata.json`: AI Studio app metadata
- `package.json`: dependencies and scripts
- `index.html`: HTML entry point
- `server.ts`: Express backend, Gemini API call, system instruction and JSON schema
- `vite.config.ts`, `tsconfig.json`: build and TypeScript configuration
- `.env.example`, `.gitignore`: environment template and ignore rules
- `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/types.ts`: React app entry, main component, styles, types
- `src/utils/exportBrief.ts`: JSON, text and Markdown export helpers
- `src/components/`: Navbar, TopicForm, ReasoningPanel, ResearchQuestionCard, KeyConceptsCard, LiteratureThemesCard, MethodologyCard, DraftAbstractCard, LimitationsCard, ExportToolbar, LoadingIndicator, HistoryDrawer
