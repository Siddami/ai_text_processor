/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface AIWindow extends Window {
  ai: {
    languageDetector: {
      capabilities: () => Promise<{ available: 'yes' | 'no' }>;
      create: (options?: { monitor?: (m: any) => void }) => Promise<any>;
    };
    translator: {
      capabilities: () => Promise<{ available: 'yes' | 'no' }>;
      create: (options?: { monitor?: (m: any) => void }) => Promise<any>;
    };
    summarizer: {
      capabilities: () => Promise<{ available: 'yes' | 'no' }>;
      create: (options?: { monitor?: (m: any) => void }) => Promise<any>;
    };
  };
}