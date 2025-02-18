// src/lib/summarizer-api.ts

// Types for Chrome Summarizer API
interface SummarizerCapabilities {
  available: "no" | "readily" | "after-download";
}

interface SummarizerOptions {
  sharedContext?: string;
  type?: 'key-points' | 'tl;dr' | 'teaser' | 'headline';
  format?: 'markdown' | 'plain-text';
  length?: 'short' | 'medium' | 'long';
}

interface SummarizeContext {
  context?: string;
}

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

// Check if the Summarizer API is available
function isSummarizerSupported(): boolean {
  return 'ai' in self && 'summarizer' in (self as any).ai;
}

// Function to check summarizer capabilities
async function checkSummarizerCapabilities(): Promise<SummarizerCapabilities> {
  if (!isSummarizerSupported()) {
    throw new Error('Summarizer API not supported in this browser');
  }

  try {
    return await (self as any).ai.summarizer.capabilities();
  } catch (error) {
    console.error('Failed to check summarizer capabilities:', error);
    throw new Error('Failed to check Summarizer API capabilities');
  }
}

// Create and initialize the summarizer
async function createSummarizer(options: SummarizerOptions = {}) {
  const capabilities = await checkSummarizerCapabilities();

  if (capabilities.available === "no") {
    throw new Error('Summarizer API is not available on this device');
  }

  const summarizer = await (self as any).ai.summarizer.create({
    ...options,
    monitor(m: any) {
      m.addEventListener('downloadprogress', (e: DownloadProgressEvent) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);
        // You can emit this progress to your UI if needed
      });
    }
  });

  if (capabilities.available === "after-download") {
    await summarizer.ready;
  }

  return summarizer;
}

// Main summarization function
export async function summarizeText(
  text: string,
  options: SummarizerOptions = {},
  context?: SummarizeContext
): Promise<string> {
  if (!text?.trim()) {
    throw new Error('Input text is required');
  }

  try {
    const summarizer = await createSummarizer(options);
    return await summarizer.summarize(text, context);
  } catch (error) {
    console.error('Summarization failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to summarize text');
  }
}

// Streaming summarization function
export async function* summarizeTextStreaming(
  text: string,
  options: SummarizerOptions = {},
  context?: SummarizeContext
): AsyncGenerator<string, void, unknown> {
  if (!text?.trim()) {
    throw new Error('Input text is required');
  }

  try {
    const summarizer = await createSummarizer(options);
    const stream = await summarizer.summarizeStreaming(text, context);

    let previousLength = 0;
    for await (const segment of stream) {
      const newContent = segment.slice(previousLength);
      previousLength = segment.length;
      yield newContent;
    }
  } catch (error) {
    console.error('Streaming summarization failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to summarize text');
  }
}
