// src/app/page.tsx
import { SummarizerAPICheck } from '../components/SummarizeAPICheck';
import SummarizerTest from '../test/Summarizertest';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Summarizer Test</h1>
      <SummarizerAPICheck />
      <SummarizerTest />
    </main>
  );
}
