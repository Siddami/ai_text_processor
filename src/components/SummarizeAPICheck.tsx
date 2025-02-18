"use client";

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface APIStatus {
  available: "no" | "readily" | "after-download" | null;
  error?: string;
}

export function SummarizerAPICheck() {
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    available: null
  });

  useEffect(() => {
    const checkAPI = async () => {
      try {
        // Check if Summarizer API exists
        if (!('ai' in self && 'summarizer' in (self as any).ai)) {
          setApiStatus({
            available: "no",
            error: 'Summarizer API not found in this browser'
          });
          return;
        }

        // Check capabilities
        const capabilities = await (self as any).ai.summarizer.capabilities();
        setApiStatus({
          available: capabilities.available
        });
      } catch (error) {
        setApiStatus({
          available: "no",
          error: error instanceof Error
            ? error.message
            : 'Failed to check API capabilities'
        });
      }
    };

    checkAPI();
  }, []);

  if (apiStatus.available === "readily" || apiStatus.available === "after-download") {
    return null;
  }

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Chrome AI Summarizer Not Available</AlertTitle>
      <AlertDescription>
        {apiStatus.error && (
          <p className="mb-2 font-medium">{apiStatus.error}</p>
        )}
        <p className="mb-2">To enable the Summarizer API:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Use Chrome Canary browser</li>
          <li>
            Enable the Summarizer API flag at:{' '}
            <code className="px-1 py-0.5 bg-gray-100 rounded">
              chrome://flags/#summarization-api-for-gemini-nano
            </code>
          </li>
          <li>Restart your browser after enabling the flag</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
}
