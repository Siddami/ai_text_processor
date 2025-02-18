"use client";

import { useState } from 'react';
import { summarizeText } from '../lib/summarize-api';

export default function SummarizerTest() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    try {
      setLoading(true);
      const result = await summarizeText(input, {
        type: 'key-points',
        format: 'markdown',
        length: 'medium'
      });
      setSummary(result);
    } catch (error) {
      console.error('Summarization failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <textarea
        className="w-full h-40 p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to summarize..."
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSummarize}
        disabled={loading || !input.trim()}
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Summary:</h3>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
}
