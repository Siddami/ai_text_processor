import { languages } from '@/lib/constants';

export const formatLanguageCode = (code: string): string => {
    return languages.find(lang => lang.value === code)?.label || code;
  };

export const formatConfidence = (confidence: number): string => {
    return `${(confidence * 100).toFixed(2)}%`;
};

