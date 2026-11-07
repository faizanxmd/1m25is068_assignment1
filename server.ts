import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import type { ResearchBrief } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '5mb' }));

const SYSTEM_INSTRUCTION = `You are a Research Paper Agent that helps students plan and draft academic papers.
Think step by step before answering. For every request, work through these steps internally and show a short "Reasoning" section first:
  Step 1 - Understand: restate the topic and identify the field, scope and audience.
  Step 2 - Narrow: turn the topic into one focused, answerable research question.
  Step 3 - Concepts: list 4-6 key concepts or variables and how they relate.
  Step 4 - Literature: outline 3-5 themes a literature review should cover, with search queries for each. Do not fabricate paper titles, authors or DOIs.
  Step 5 - Method: propose a suitable methodology (qualitative, quantitative, mixed, experimental, survey, systematic review) and justify it in one or two sentences.
  Step 6 - Draft: write a 150-200 word abstract.
  Step 7 - Check: list limitations, ethical considerations and open questions.
Return the final answer as JSON matching the schema shown in the examples.

CRITICAL CITATION INTEGRITY RULE:
Never invent citations: any paper mentioned must be explicitly marked "verify" unless the user supplied it in the prompt. Do not fabricate paper titles, authors, journals, or DOIs. Always provide actionable search queries for Google Scholar, arXiv, and academic repositories instead.

EXAMPLE 1
Input: "Effect of social media on sleep in teenagers"
Output:
{
  "reasoning": "Field is public health / psychology. Topic is broad; narrowing to night-time use and sleep duration makes it measurable.",
  "research_question": "Is night-time social media use associated with shorter sleep duration among adolescents aged 13-18?",
  "key_concepts": ["night-time screen use", "sleep duration", "sleep quality", "fear of missing out", "blue-light exposure"],
  "literature_themes": [
    {"theme": "Screen time and sleep outcomes", "search_queries": ["adolescent social media sleep duration", "bedtime screen use teenagers sleep"]},
    {"theme": "Psychological mechanisms", "search_queries": ["fear of missing out sleep adolescents"]}
  ],
  "methodology": "Cross-sectional survey with validated sleep questionnaires; suits measuring associations across a large sample.",
  "draft_abstract": "Adolescent sleep deficiency is a mounting public health priority associated with depressive symptoms, cognitive decline, and metabolic disruption. Concurrently, pervasive digital device adoption has concentrated smartphone consumption in the pre-sleep window. This paper investigates whether nocturnal social media engagement is inversely correlated with total nocturnal sleep duration among teenagers aged 13 to 18. Employing a cross-sectional survey methodology administering validated self-report instruments (the Pittsburgh Sleep Quality Index and Munich ChronoType Questionnaire), we analyze self-reported screen consumption alongside sleep latency and nocturnal wake episodes. Expected findings elucidate the distinct contributions of displaced sleep time, continuous cognitive arousal stemming from the fear of missing out (FOMO), and melatonin suppression via short-wavelength light exposure. By delineating the direct and mediator pathways linking nighttime social networking to truncated sleep architecture, this study establishes actionable empirical benchmarks for pediatric sleep hygiene frameworks and adolescent digital health interventions.",
  "limitations": ["self-reported data", "correlation not causation"],
  "verify_note": "No specific papers cited; use the search queries to find sources."
}

EXAMPLE 2
Input: "Using transformers for crop disease detection"
Output:
{
  "reasoning": "Field is computer vision / agriculture. Narrowing to a comparison with CNNs on leaf images gives a testable question.",
  "research_question": "Do vision transformers outperform CNNs in classifying crop leaf diseases on limited-size datasets?",
  "key_concepts": ["vision transformer", "convolutional neural network", "transfer learning", "plant disease dataset", "classification accuracy"],
  "literature_themes": [
    {"theme": "Deep learning for plant disease", "search_queries": ["plant disease detection deep learning review"]},
    {"theme": "ViT vs CNN on small datasets", "search_queries": ["vision transformer small dataset performance"]}
  ],
  "methodology": "Experimental comparison of pretrained ViT and CNN models with cross-validation and accuracy/F1 metrics.",
  "draft_abstract": "Automated leaf disease diagnosis via computer vision is vital for precision agriculture, yet real-world farm environments frequently suffer from sparse training datasets and variable field illumination. While Convolutional Neural Networks (CNNs) have long represented the benchmark for plant pathology recognition, Vision Transformers (ViTs) introduce self-attention mechanisms capable of capturing global contextual dependencies. This investigation evaluates whether modern Vision Transformers achieve superior diagnostic accuracy and cross-domain generalization compared to standard CNN architectures (such as ResNet-50 and EfficientNet) when trained on limited-sample agricultural datasets. Utilizing transfer learning across standardized multi-class leaf blight and rust image corpora, we benchmark top-1 classification accuracy, macro F1-score, and parameter efficiency under five-fold cross-validation. Preliminary analytical assessments reveal that while ViTs require robust inductive bias initialization, fine-tuned token representations demonstrate heightened resilience against occlusion and specular leaf reflection compared to local convolutional kernels.",
  "limitations": ["dataset bias toward lab images", "compute cost"],
  "verify_note": "No specific papers cited; use the search queries to find sources."
}

Now answer the user's input in the same format.`;

const briefResponseSchema = {
  type: Type.OBJECT,
  properties: {
    reasoning: {
      type: Type.STRING,
      description: 'Step-by-step reasoning covering field, scope, audience, and narrowing rationale.',
    },
    research_question: {
      type: Type.STRING,
      description: 'A single focused, answerable, academic research question.',
    },
    key_concepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4-6 key concepts, variables, or theoretical constructs.',
    },
    literature_themes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          theme: {
            type: Type.STRING,
            description: 'Name of the literature review theme or angle.',
          },
          search_queries: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Specific search queries suitable for Google Scholar and arXiv.',
          },
        },
        required: ['theme', 'search_queries'],
      },
      description: '3-5 themes for the literature review with actionable search queries.',
    },
    methodology: {
      type: Type.STRING,
      description: 'Proposed methodology and 1-2 sentence justification.',
    },
    draft_abstract: {
      type: Type.STRING,
      description: 'A 150-200 word academic abstract drafting context, question, method, expected findings, and significance.',
    },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key methodological limitations, ethical considerations, and open questions.',
    },
    verify_note: {
      type: Type.STRING,
      description: 'Citation verification disclaimer and instruction.',
    },
  },
  required: [
    'reasoning',
    'research_question',
    'key_concepts',
    'literature_themes',
    'methodology',
    'draft_abstract',
    'limitations',
    'verify_note',
  ],
};

// API Routes
app.post('/api/generate-brief', async (req: Request, res: Response) => {
  try {
    const { topic, existingText } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Please provide a valid research topic or question.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment or Settings > Secrets panel.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = `RESEARCH TOPIC / QUESTION:\n${topic.trim()}\n`;
    if (existingText && typeof existingText === 'string' && existingText.trim()) {
      prompt += `\nUSER SUPPLIED EXISTING ABSTRACT / NOTES / CONTEXT:\n${existingText.trim()}\n`;
    }

    let response: any = null;
    let lastError: any = null;
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const model of candidateModels) {
      try {
        console.log(`[Research Paper Agent] Attempting generation with ${model}...`);
        const config: any = {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: briefResponseSchema,
        };

        if (model === 'gemini-3.8-flash') {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        if (response && response.text) {
          console.log(`[Research Paper Agent] Generation succeeded with ${model}.`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Research Paper Agent] Model ${model} failed:`, err?.message || err);
        // Continue to fallback model if 503 / 429 / high demand
        const isDemandIssue =
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('429');

        if (!isDemandIssue) {
          // If it's a fatal validation or auth issue, break
          break;
        }
      }
    }

    if (!response || !response.text) {
      let errorMsg = 'Failed to generate research brief after multiple attempts.';
      if (lastError?.message) {
        try {
          const parsedErr = JSON.parse(lastError.message);
          if (parsedErr?.error?.message) {
            errorMsg = parsedErr.error.message;
          } else {
            errorMsg = lastError.message;
          }
        } catch {
          errorMsg = lastError.message;
        }
      }
      res.status(503).json({ error: errorMsg });
      return;
    }

    const rawText = response.text;
    if (!rawText) {
      res.status(502).json({ error: 'Did not receive a response from Gemini model.' });
      return;
    }

    let parsed: ResearchBrief;
    try {
      parsed = JSON.parse(rawText.trim());
    } catch {
      // In case wrapped in markdown code blocks
      const cleanJson = rawText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    // Attach metadata
    const enrichedBrief: ResearchBrief = {
      ...parsed,
      id: `brief-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      topic: topic.trim(),
      existing_text: existingText?.trim() || undefined,
    };

    res.json({ brief: enrichedBrief });
  } catch (error: unknown) {
    console.error('Error generating research brief:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while generating the brief.';
    res.status(500).json({ error: message });
  }
});

// App status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Dev Vite middleware or Production static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Research Paper Agent] Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
