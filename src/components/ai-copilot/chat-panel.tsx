'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  Send,
  Trash2,
  Loader2,
  FileText,
} from 'lucide-react';
import { useCopilot } from './copilot-provider';
import { CopilotMessageBubble } from './message-bubble';
import { CopilotQuickActions } from './quick-actions';

export function CopilotChatPanel() {
  const { messages, isLoading, sendMessage, clearMessages, toggleOpen, resumeContent, uploadResume } = useCopilot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        uploadResume(text);
        setInput(`请帮我评测这份简历：\n\n${text.slice(0, 500)}${text.length > 500 ? '...' : ''}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 right-6 z-[100] w-[400px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-6rem)] bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#38383a] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f2] dark:border-[#2c2c2e] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
              AI 简历导师
            </h3>
            <p className="text-[11px] text-[#86868b]">引导式辅导 · 陪你一起写</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#ff375f] hover:bg-[#ffeaea] dark:hover:bg-[#3d1111] transition-all"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleOpen}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f0f0f2] dark:hover:bg-[#2c2c2e] transition-all"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length <= 1 && (
          <CopilotQuickActions onSelect={handleQuickQuestion} />
        )}
        {messages.map((msg) => (
          <CopilotMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-[#f0f0f2] dark:border-[#2c2c2e] shrink-0">
        {/* Resume context indicator */}
        {resumeContent && (
          <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-[#0071e3]/8 dark:bg-[#0071e3]/12 rounded-xl">
            <FileText className="w-3.5 h-3.5 text-[#0071e3]" />
            <span className="text-[12px] text-[#0071e3] font-medium truncate flex-1">
              已加载简历内容
            </span>
            <button
              onClick={() => uploadResume('')}
              className="text-[11px] text-[#0071e3]/60 hover:text-[#0071e3]"
            >
              清除
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* File upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/8 transition-all shrink-0"
            title="上传简历文件"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="向 AI 简历导师提问..."
            rows={1}
            className="flex-1 resize-none bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-2xl px-4 py-2.5 text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#aeaeb2] outline-none focus:ring-2 focus:ring-[#0071e3]/20 max-h-32"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0071e3] text-white hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            title="发送"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
