'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CopilotProvider, useCopilot } from './copilot-provider';
import { CopilotChatPanel } from './chat-panel';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAuth } from '@/lib/auth-context';

function CopilotWidgetInner() {
  const { isAuthenticated } = useAuth();
  const { isOpen, toggleOpen } = useCopilot();
  const { t } = useLocale();
  const c = t.copilot;
  const [showHint, setShowHint] = useState(true);

  if (!isAuthenticated) return null;

  const handleOpen = () => {
    setShowHint(false);
    toggleOpen();
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 select-none">
          {showHint && (
            <button
              type="button"
              onClick={handleOpen}
              className="bg-white dark:bg-[#1c1c1e] rounded-2xl px-4 py-2.5 shadow-lg border border-[#e8e8ed] dark:border-[#38383a] animate-fade-in max-w-[220px] text-left"
            >
              <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
                {c.hint}
              </p>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpen}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#5856d6] text-white shadow-lg shadow-[#0071e3]/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 will-change-transform"
            aria-label={c.open}
          >
            <Sparkles className="w-6 h-6" />
          </button>
        </div>
      )}

      {isOpen && <CopilotChatPanel />}
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
