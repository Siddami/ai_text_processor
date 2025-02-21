// Basic interfaces.
export interface ProcessingState {
  summarizing: boolean;
  translating: boolean;
}

export interface Message {
  id: string;
  text: string;
  detectedLanguage?: string;
  confidence?: number;
  summary?: string;
  translation?: string;
  processing?: ProcessingState;
}

export interface LanguagePrediction {
  confidence: number;
  detectedLanguage: string;
}

export interface Language {
  value: string;
  label: string;
}

// Event and monitor interfaces
interface DownloadProgressEvent {
  loaded: number;
  total: number;
}

interface Monitor {
  addEventListener(event: 'downloadprogress', callback: (event: DownloadProgressEvent) => void): void;
}

// Chrome AI API interfaces
interface LanguageDetector {
  detect(text: string): Promise<LanguagePrediction[]>;
}

export interface Translator {
  translate(text: string): Promise<{ translation: string }>;
}

interface Summarizer {
  summarize(text: string): Promise<{ summary: string } | { summary: string }[]>;
}


interface Capabilities {
  available: 'yes' | 'no' | 'after-download';
  languagePairAvailable?: (source: string, target: string) => Promise<'readily' | 'after-download' | 'no'>;
}

interface AILanguageDetectorAPI {
  capabilities(): Promise<Capabilities>;
  create(options: { monitor?: (m: Monitor) => void }): Promise<LanguageDetector>;
}

interface AITranslatorAPI {
  capabilities(): Promise<Capabilities>;
  create(options: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (m: Monitor) => void;
  }): Promise<Translator>;
}

interface AISummarizerAPI {
  capabilities(): Promise<Capabilities>;
  create(options: { monitor?: (m: Monitor) => void }): Promise<Summarizer>;
}

// Main AIWindow interface
export interface AI {
  languageDetector: AILanguageDetectorAPI;
  translator: AITranslatorAPI;
  summarizer: AISummarizerAPI;
}

export interface AIWindow {
  ai: AI;
}