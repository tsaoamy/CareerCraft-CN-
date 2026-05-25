'use client';

import React, { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { CopilotMessage, ReviewResult, EnhancementResult, MatchResult } from '@/lib/ai/types';
import { WELCOME_MESSAGE } from '@/lib/ai/prompts';

interface CopilotContextType {
  isOpen: boolean;
  messages: CopilotMessage[];
  isLoading: boolean;
  toggleOpen: () => void;
  sendMessage: (content: string, mode?: 'chat' | 'review' | 'enhance' | 'match') => Promise<void>;
  clearMessages: () => void;
  uploadResume: (content: string) => void;
  setTargetJD: (jd: string) => void;
  resumeContent: string;
  targetJD: string;
}

const CopilotContext = createContext<CopilotContextType | null>(null);

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const [targetJD, setTargetJD] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const uploadResume = useCallback((content: string) => {
    setResumeContent(content);
  }, []);

  const sendMessage = useCallback(
    async (content: string, mode: 'chat' | 'review' | 'enhance' | 'match' = 'chat') => {
      // Add user message
      const userMsg: CopilotMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Add loading placeholder
      const loadingId = generateId();
      const loadingMsg: CopilotMessage = {
        id: loadingId,
        role: 'assistant',
        content: '正在思考...',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, loadingMsg]);

      try {
        // Determine endpoint
        let endpoint = '/api/ai/chat';
        let body: Record<string, unknown> = {
          messages: [
            ...messages
              .filter((m) => m.role !== 'system')
              .map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          mode,
          context: {
            resumeContent,
            projectExperience: content, // For enhance mode
            jobDescription: targetJD,
          },
        };

        if (mode === 'review') {
          endpoint = '/api/ai/review';
          body = { resumeContent: content };
        } else if (mode === 'enhance') {
          endpoint = '/api/ai/enhance';
          body = { projectDescription: content };
        } else if (mode === 'match') {
          endpoint = '/api/ai/match';
          body = { resumeContent: resumeContent || content, jdContent: targetJD || content };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        // Replace loading message with actual response
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === loadingId) {
              return {
                id: generateId(),
                role: 'assistant' as const,
                content: data.message || data.error || '收到回复',
                timestamp: Date.now(),
                structured: !!data.data,
                data: data.data || null,
              };
            }
            return m;
          })
        );
      } catch (error: any) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === loadingId) {
              return {
                id: generateId(),
                role: 'assistant' as const,
                content: '抱歉，我暂时无法回复。请稍后重试。',
                timestamp: Date.now(),
              };
            }
            return m;
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, resumeContent, targetJD]
  );

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        toggleOpen,
        sendMessage,
        clearMessages,
        uploadResume,
        setTargetJD,
        resumeContent,
        targetJD,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot(): CopilotContextType {
  const ctx = useContext(CopilotContext);
  if (!ctx) throw new Error('useCopilot must be used within CopilotProvider');
  return ctx;
}
