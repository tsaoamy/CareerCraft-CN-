'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { CopilotProvider, useCopilot } from './copilot-provider';
import { CopilotChatPanel } from './chat-panel';

function CopilotWidgetInner() {
  const { isOpen, toggleOpen } = useCopilot();

  return (
    <>
      {/* 悬浮按钮 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] text-white shadow-lg shadow-[#0071e3]/25 flex items-center justify-center hover:shadow-xl hover:shadow-[#0071e3]/30 transition-shadow duration-300"
            aria-label="打开 AI 简历导师"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 非展开状态的小标签 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 2, duration: 0.4 }}
            className="fixed bottom-[88px] right-6 z-[100] bg-white dark:bg-[#1c1c1e] rounded-2xl px-4 py-2.5 shadow-lg border border-[#e8e8ed] dark:border-[#38383a]"
          >
            <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap">
              👋 需要帮忙写简历吗？
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 聊天面板 */}
      <AnimatePresence>
        {isOpen && <CopilotChatPanel key="chat-panel" />}
      </AnimatePresence>
    </>
  );
}

export function AICopilotWidget() {
  return (
    <CopilotProvider>
      <CopilotWidgetInner />
    </CopilotProvider>
  );
}
