'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  Send,
  Trash2,
  Loader2,
  FileText,
  Wifi,
  WifiOff,
  GripVertical,
} from 'lucide-react';
import { readResumeFile, RESUME_FILE_ACCEPT } from '@/lib/resume-extract';
import { useCopilot } from './copilot-provider';
import { CopilotMessageBubble } from './message-bubble';
import { CopilotQuickActions } from './quick-actions';
import { resolveErrorMessage } from '@/lib/i18n/error-messages';
import { useLocale } from '@/lib/i18n/locale-context';
import { useSystemFeedback } from '@/lib/feedback/use-system-feedback';
import { useDraggableFloat } from '@/hooks/use-draggable-float';

export function CopilotChatPanel() {
  const { t, locale } = useLocale();
  const c = t.copilot;
  const fb = useSystemFeedback();
  const { messages, isLoading, aiSource, sendMessage, clearMessages, toggleOpen, resumeContent, uploadResume } = useCopilot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { nodeRef, style, isDragging, dragHandleProps } = useDraggableFloat({
    storageKey: 'careercraft_float_copilot_panel',
    anchor: 'bottom-right',
    margin: 20,
    topInset: 72,
  });

  const visibleMessages = messages.filter((m) => !m.pending);
  const hasUserMessages = visibleMessages.some((m) => m.role === 'user');
  const chatMessages = hasUserMessages
    ? visibleMessages
    : visibleMessages.filter((m) => m.id !== 'welcome');

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 输入框自动增高
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const text = await readResumeFile(file);
      if (text) {
        uploadResume(text);
        sendMessage(c.reviewPrompt, 'review');
        fb.success('uploadComplete');
      }
    } catch (err) {
      const ca = t.commonActions;
      fb.raw.error(resolveErrorMessage(err instanceof Error ? err.message : ca.uploadFailed, locale, ca.uploadFailed));
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ ...style, zIndex: 100 }}
      className={`w-[400px] max-w-[calc(100vw-2rem)] h-[min(640px,calc(100vh-5rem))] bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#38383a] flex flex-col overflow-hidden select-none ${isDragging ? 'opacity-95' : ''}`}
    >
      {/* Header — 拖动区域 */}
      <div
        {...dragHandleProps}
        className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f2] dark:border-[#2c2c2e] shrink-0 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-sm"
      >
        <GripVertical className="w-4 h-4 text-[#86868b]/40 shrink-0 mr-1" />
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight truncate">
              {c.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-[#86868b] truncate">{c.subtitle}</p>
              {aiSource && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium shrink-0 ${
                    aiSource === 'ai'
                      ? 'text-[#34c759] bg-[#34c759]/10'
                      : 'text-[#ff9500] bg-[#ff9500]/10'
                  }`}
                >
                  {aiSource === 'ai' ? (
                    <Wifi className="w-2 h-2" />
                  ) : (
                    <WifiOff className="w-2 h-2" />
                  )}
                  {aiSource === 'ai' ? 'AI' : c.offline}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={clearMessages}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#ff375f] hover:bg-[#ffeaea] dark:hover:bg-[#3d1111] transition-all"
            title={c.clear}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleOpen}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f0f0f2] dark:hover:bg-[#2c2c2e] transition-all"
            title={c.close}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 custom-scrollbar">
        {!hasUserMessages && (
          <CopilotQuickActions
            locale={locale}
            onSelect={handleQuickQuestion}
            onUploadResume={triggerUpload}
          />
        )}
        {chatMessages.map((msg) => (
          <CopilotMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-[#86868b]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0071e3]" />
            {c.thinking}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3.5 py-2.5 border-t border-[#f0f0f2] dark:border-[#2c2c2e] shrink-0 bg-[#fafafa] dark:bg-[#161618]">
        {resumeContent && (
          <div className="mb-2 flex items-center gap-2 px-2.5 py-1.5 bg-[#0071e3]/8 dark:bg-[#0071e3]/12 rounded-lg">
            <FileText className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
            <span className="text-[11px] text-[#0071e3] font-medium truncate flex-1">
              {c.resumeLoaded}
            </span>
            <button
              type="button"
              onClick={() => uploadResume('')}
              className="text-[10px] text-[#0071e3]/70 hover:text-[#0071e3] shrink-0"
            >
              {c.clearResume}
            </button>
          </div>
        )}

        <div className="flex items-end gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept={RESUME_FILE_ACCEPT}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerUpload}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/8 transition-all shrink-0"
            title={c.uploadResume}
          >
            <FileText className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={c.placeholder}
              rows={1}
              className="w-full resize-none bg-white dark:bg-[#2c2c2e] rounded-xl px-3 py-2 text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#aeaeb2] outline-none focus:ring-2 focus:ring-[#0071e3]/25 border border-[#e8e8ed] dark:border-[#38383a] leading-relaxed"
              style={{ maxHeight: 120 }}
            />
            <p className="text-[9px] text-[#aeaeb2] mt-1 px-1 hidden sm:block">{c.inputHint}</p>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0071e3] text-white hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-0 sm:mb-4"
            title={c.send}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
