export interface LiteratureTheme {
  theme: string;
  search_queries: string[];
}

export interface ResearchBrief {
  id?: string;
  created_at?: string;
  topic: string;
  existing_text?: string;
  reasoning: string;
  research_question: string;
  key_concepts: string[];
  literature_themes: LiteratureTheme[];
  methodology: string;
  draft_abstract: string;
  limitations: string[];
  verify_note: string;
}

export interface GenerateBriefRequest {
  topic: string;
  existingText?: string;
}

export interface GenerateBriefResponse {
  brief?: ResearchBrief;
  error?: string;
}
