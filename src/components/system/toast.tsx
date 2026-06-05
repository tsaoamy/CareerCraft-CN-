"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "processing" | "warning";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  processing: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  processing: Loader2,
  warning: AlertTriangle,
};

const typeStyles: Record<ToastType, string> = {
  success: "border-volt/30 shadow-[0_8px_32px_rgba(184,230,0,0.08)]",
  error: "border-sale/30 shadow-[0_8px_32px_rgba(211,0,5,0.08)]",
  info: "border-white/10",
  processing: "border-volt/20 shadow-[0_8px_32px_rgba(184,230,0,0.05)]",
  warning: "border-volt/20",
};

const iconStyles: Record<ToastType, string> = {
  success: "text-volt",
  error: "text-sale",
  info: "text-stone",
  processing: "text-volt animate-spin",
  warning: "text-volt/80",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      const duration = type === "processing" ? 2500 : 4200;
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    toast: addToast,
    success: (m) => addToast(m, "success"),
    error: (m) => addToast(m, "error"),
    info: (m) => addToast(m, "info"),
    processing: (m) => addToast(m, "processing"),
    warning: (m) => addToast(m, "warning"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.94, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 32, scale: 0.94, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "system-toast pointer-events-auto relative flex items-start gap-3 p-4 pr-10",
                  typeStyles[t.type]
                )}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", iconStyles[t.type])} />
                </motion.div>
                <p className="text-caption-md text-white leading-relaxed">{t.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="absolute top-3 right-3 text-mute hover:text-white transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
