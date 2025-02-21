declare global {
  interface Window extends AIWindow {}
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string
): Promise<string> {
  if (!('ai' in window) || !('translator' in window.ai)) {
    throw new Error(
      "Chrome AI Translator API is not supported. Please ensure you're using Chrome and have the Translation API enabled."
    );
  }

  try {
    const translatorCapabilities = await window.ai.translator.capabilities();
    const availability = await translatorCapabilities.languagePairAvailable?.(sourceLanguage, targetLanguage);
    
    console.log(`Translation availability status: ${availability}`);
    console.log(`Attempting translation from ${sourceLanguage} to ${targetLanguage}`);

    if (availability === 'no') {
      throw new Error(
        `Translation from ${sourceLanguage} to ${targetLanguage} is not supported. ` +
        'Please verify that these languages are supported in Chrome.'
      );
    }

    let translator: Translator;
    try {
      translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor: (m) => {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
    } catch (createError) {
      if (createError instanceof Error && createError.name === 'NotSupportedError') {
        throw new Error(
          `Unable to translate between ${sourceLanguage} and ${targetLanguage}. Please verify that:\n` +
          '1. At least one of these languages is set as preferred in Chrome settings\n' +
          '2. You have an active internet connection\n' +
          '3. You are using Chrome with the Translation API enabled'
        );
      }
      throw createError;
    }

    const result = await translator.translate(text);
    
    if (typeof result === 'object' && 'translation' in result) {
      return result.translation;
    } else if (typeof result === 'string') {
      return result;
    }
    
    throw new Error("Unexpected response format from translator");
  } catch (error) {
    console.error('Translation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to translate text');
  }
}

export async function detectLanguage(text: string): Promise<{ 
  detectedLanguage: string; 
  confidence: number 
}> {
  if (!('ai' in window) || !('languageDetector' in window.ai)) {
    throw new Error("Language detection API is not available");
  }

  try {
    const capabilities = await window.ai.languageDetector.capabilities();
    if (capabilities.available === 'no') {
      throw new Error("Language detection is not available on this system");
    }

    const detector = await window.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Language model download progress: ${e.loaded}/${e.total} bytes`);
        });
      },
    });

    const result = await detector.detect(text);
    console.log('Language detection result:', result);

    if (Array.isArray(result)) {
      const bestPrediction = result.reduce((prev, current) => 
        current.confidence > prev.confidence ? current : prev
      );

      return {
        detectedLanguage: bestPrediction.detectedLanguage,
        confidence: bestPrediction.confidence
      };
    }
    
    throw new Error("Unexpected response format from language detector");
  } catch (error) {
    console.error('Language detection error:', error);
    throw new Error('Failed to detect language');
  }
}

export async function summarizeText(text: string): Promise<string> {
  if (!('ai' in window) || !('summarizer' in window.ai)) {
    throw new Error("Summarization API is not available");
  }

  try {
    const capabilities = await window.ai.summarizer.capabilities();
    if (capabilities.available === 'no') {
      throw new Error("Summarization is not available on this system");
    }

    const summarizer = await window.ai.summarizer.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.log(`Summarization model download progress: ${e.loaded}/${e.total} bytes`);
        });
      },
    });

    const result = await summarizer.summarize(text);

    if (result) {
      if (typeof result === 'string') {
        return result;
      }
      if (typeof result === 'object') {
        if ('summary' in result && typeof result.summary === 'string') {
          return result.summary;
        }
        if (Array.isArray(result)) {
          return result.join('\n');
        }
      }
    }
    
    throw new Error("Unexpected response format from summarizer");
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to summarize text');
  }
}