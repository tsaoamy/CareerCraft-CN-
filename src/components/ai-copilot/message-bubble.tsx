'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import type { CopilotMessage } from '@/lib/ai/types';
import { ReviewCard } from './review-card';
import { EnhancementCard } from './enhancement-card';
import { MatchCard } from './match-card';

export function CopilotMessageBubble({ message }: { message: CopilotMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-gradient-to-br from-[#8944ab] to-[#ff375f]'
            : 'bg-gradient-to-br from-[#0071e3] to-[#5856d6]'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Text message */}
        {message.content && !message.structured && (
          <div
            className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-[#0071e3] text-white rounded-tr-md'
                : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-tl-md'
            }`}
          >
            {/* Render markdown-like bold */}
            {renderMessageContent(message.content)}
          </div>
        )}

        {/* Structured data cards */}
        {message.structured && message.data && (
          <div className="mt-2 max-w-[95%]">
            {renderStructuredCard(message)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function renderMessageContent(content: string) {
  // Simple markdown-like rendering
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderStructuredCard(message: CopilotMessage) {
  if (!message.data) return null;

  // Detect card type by inspecting data shape
  const data = message.data as unknown as Record<string, unknown>;

  if ('overallScore' in data && 'highlights' in data && 'risks' in data) {
    return <ReviewCard data={data as unknown as any} />;
  }

  if ('starFramework' in data && 'coachQuestions' in data) {
    return <EnhancementCard data={data as unknown as any} />;
  }

  if ('matchScore' in data && 'skillAnalysis' in data) {
    return <MatchCard data={data as unknown as any} />;
  }

  return null;
}
