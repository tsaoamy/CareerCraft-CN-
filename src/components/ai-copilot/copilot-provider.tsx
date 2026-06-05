'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { CopilotMessage } from '@/lib/ai/types';
import { getWelcomeMessage } from '@/lib/ai/prompts';
import { detectCopilotMode } from '@/lib/ai/offline-chat';
import { useLocale } from '@/lib/i18n/locale-context';
import { translations } from '@/lib/i18n/translations';

interface CopilotContextType {
  isOpen: boolean;
  messages: CopilotMessage[];
  isLoading: boolean;
  aiSource: 'ai' | 'offline' | null;
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


function makeWelcome(locale: 'en' | 'zh'): CopilotMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content: getWelcomeMessage(locale),
    timestamp: Date.now(),
  };
}

export function CopilotProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([makeWelcome(locale)]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSource, setAiSource] = useState<'ai' | 'offline' | null>(null);
  const [resumeContent, setResumeContent] = useState('');
  const [targetJD, setTargetJDState] = useState('');
  const resumeRef = useRef('');
  const targetJDRef = useRef('');

  useEffect(() => {
    setMessages((prev) => {
      const nonWelcome = prev.filter((m) => m.id !== 'welcome');
      if (nonWelcome.length === 0) return [makeWelcome(locale)];
      return prev;
    });
  }, [locale]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([makeWelcome(locale)]);
    setAiSource(null);
  }, [locale]);

  const uploadResume = useCallback((content: string) => {
    resumeRef.current = content;
    setResumeContent(content);
  }, []);

  const setTargetJD = useCallback((jd: string) => {
    targetJDRef.current = jd;
    setTargetJDState(jd);
  }, []);

  const sendMessage = useCallback(
    async (content: string, explicitMode?: 'chat' | 'review' | 'enhance' | 'match') => {
      const resume = resumeRef.current;
      const jd = targetJDRef.current;
      const mode = explicitMode ?? detectCopilotMode(content, resume, jd);

      const userMsg: CopilotMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      const loadingId = generateId();
      const loadingMsg: CopilotMessage = {
        id: loadingId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        pending: true,
      };

      let historyForApi: { role: string; content: string }[] = [];

      setMessages((prev) => {
        historyForApi = prev
          .filter((m) => !m.pending && m.content.length > 0 && m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }));
        historyForApi.push({ role: 'user', content });
        return [...prev, userMsg, loadingMsg];
      });

      setIsLoading(true);
      const tc = translations[locale].copilot;

      try {
        let endpoint = '/api/ai/chat';
        let body: Record<string, unknown> = {
          messages: historyForApi,
          mode: 'chat',
          context: {
            resumeContent: resume,
            projectExperience: content,
            jobDescription: jd,
          },
        };

        if (mode === 'review') {
          endpoint = '/api/ai/review';
          body = { resumeContent: resume || content };
        } else if (mode === 'enhance') {
          endpoint = '/api/ai/enhance';
          body = { projectDescription: content };
        } else if (mode === 'match') {
          endpoint = '/api/ai/match';
          body = { resumeContent: resume || content, jdContent: jd || content };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        const source: 'ai' | 'offline' = data.meta?.source === 'ai' ? 'ai' : 'offline';
        setAiSource(source);

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== loadingId) return m;
            return {
              id: generateId(),
              role: 'assistant' as const,
              content: data.message || data.error || tc.replyFallback,
              timestamp: Date.now(),
              structured: !!data.data,
              data: data.data || null,
              source,
            };
          })
        );
      } catch {
        setAiSource('offline');
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== loadingId) return m;
            return {
              id: generateId(),
              role: 'assistant' as const,
              content: tc.errorReply,
              timestamp: Date.now(),
              source: 'offline' as const,
            };
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [locale],
  );

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        aiSource,
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
