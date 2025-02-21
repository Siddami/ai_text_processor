"use client"

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { detectLanguage, translateText, summarizeText } from '@/lib/ai-apis';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Message} from '@/types';
import { languages } from '@/lib/constants';
import { formatLanguageCode, formatConfidence } from '@/lib/helpers';

const TextProcessor = () => {
  const [messages, setMessages] = useState<(Message & { selectedLanguage: string })[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 4000);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setError(null);

    try {
      const { detectedLanguage, confidence } = await detectLanguage(inputText);
      
      const newMessage: Message & { selectedLanguage: string } = {
        id: Date.now().toString(),
        text: inputText.trim(),
        detectedLanguage,
        confidence,
        selectedLanguage: 'en', 
        processing: {
          summarizing: false,
          translating: false
        }
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    } catch (err) {
      handleError('Failed to process message. Please try again.');
      console.error('Error processing message:', err);
    }
  };

  const handleSummarize = async (messageId: string) => {
    setError(null);

    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, processing: { 
            ...message.processing, 
            summarizing: true, 
            translating: message.processing?.translating ?? false
          } }
        : message
    ));

    try {
      const messageToUpdate = messages.find(m => m.id === messageId);
      if (!messageToUpdate) return;

      const summary = await summarizeText(messageToUpdate.text);

      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { 
              ...message, 
              summary,
              processing: { 
                ...message.processing, 
                summarizing: false,
                translating: message.processing?.translating ?? false 
              }
            }
          : message
      ));
    } catch (err) {
      handleError('Failed to summarize text. Please try again.');
      console.error('Error summarizing text:', err);
      
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, processing: { 
              ...message.processing, 
              summarizing: false ,
              translating: message.processing?.translating ?? false
            } }
          : message
      ));
    }
  };

  const handleLanguageChange = (messageId: string, language: string) => {
    setMessages(prev => prev.map(message =>
      message.id === messageId
        ? { ...message, selectedLanguage: language }
        : message
    ));
  };

  const handleTranslate = async (messageId: string) => {
    setError(null);

    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, processing: { 
            ...message.processing, 
            translating: true,
            summarizing: message.processing?.summarizing ?? false 
          } }
        : message
    ));

    try {
      const messageToUpdate = messages.find(m => m.id === messageId);
      if (!messageToUpdate?.detectedLanguage) {
        setError('Detected language not found.');
        setMessages(prev => prev.map(message => 
          message.id === messageId 
            ? { ...message, processing: { 
              ...message.processing, 
              translating: false,
              summarizing: message.processing?.summarizing ?? false
             } }
            : message
        ));
        return;
      }

      const translation = await translateText(
        messageToUpdate.text,
        messageToUpdate.selectedLanguage, // Use message-specific selected language
        messageToUpdate.detectedLanguage
      );

      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { 
              ...message, 
              translation,
              processing: { 
                ...message.processing, 
                translating: false ,
                summarizing: message.processing?.summarizing ?? false
              }
            }
          : message
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to translate text';
      handleError(errorMessage);
      console.error('Error translating text:', err);
      
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, processing: { 
              ...message.processing, 
              translating: false,
              summarizing: message.processing?.summarizing ?? false
             } }
          : message
      ));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-[90%] mx-auto p-4" role='main'>
      {error && (
        <Alert className="mb-4 bg-red-100 border-red-400 text-red-700 animate-fade-in-out" role="alert" aria-live="assertive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="flex-1 mb-4 overflow-hidden border-none space-y-5" aria-label="Text Processor">
        <CardContent className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2 w-[85%] lg:w-[60%] bg-purple-950 text-white p-4 rounded-xl shadow-lg" tabIndex={0} aria-label={`Message ${message.text}`}>
              <div className="bg-secondary p-3 rounded-lg">
                <p className="text-secondary-foreground textShadow-lg">{message.text}</p>
              </div>
              
              {message.detectedLanguage && (
                <p className="text-sm text-muted-foreground font-bold bg-purple-700 text-slate-100 p-2 w-2/4 rounded-2xl" aria-label={`Detected Language: ${formatLanguageCode(message.detectedLanguage)} with confidence ${message.confidence}`}>
                  Detected Language: {formatLanguageCode(message.detectedLanguage)}
                  {message.confidence && ` (Confidence: ${formatConfidence(message.confidence)})`}
                </p>
              )}

              <div className="flex items-center gap-2">
                {message.text.length > 150 && message.detectedLanguage === 'en' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSummarize(message.id)}
                    disabled={message.processing?.summarizing}
                    className='hover:bg-purple-600'
                    aria-label="Summarize text"
                  >
                    {message.processing?.summarizing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true"/>
                    ) : null}
                    Summarize
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <Select
                    value={message.selectedLanguage}
                    onValueChange={(value) => handleLanguageChange(message.id, value)}
                    disabled={message.processing?.translating}
                    aria-label="Select Language"
                  >
                    <SelectTrigger className="w-32 hover:bg-purple-600">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className='bg-violet-400'>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} aria-label={`Translate to ${lang.label}`}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTranslate(message.id)}
                    disabled={message.processing?.translating}
                    className='hover:bg-purple-600'
                    aria-label="Translate text"
                  >
                    {message.processing?.translating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true"/>
                    ) : null}
                    Translate
                  </Button>
                </div>
              </div>

              {message.summary && (
                <div className="bg-purple-700 text-slate-100 p-3 rounded-xl" role="region" aria-label="Summary">
                  <p className="text-sm font-medium">Summary:</p>
                  {message.summary.split('\n').map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {message.translation && (
                <div className="bg-purple-700 text-slate-100 p-3 rounded-xl w-2/4" role="region" aria-label="Translation">
                  <p className="text-sm font-medium">Translation:</p>
                  <p>{message.translation}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 border-red-50 border rounded-2xl">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="resize-none border-none"
          rows={3}
          aria-label="Text input area"
        />
        <Button 
          onClick={handleSend}
          size="icon"
          className="h-auto "
          aria-label="Send text"
          disabled={!inputText.trim()}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default TextProcessor;