"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type InputState = "default" | "error" | "success" | "loading";

export interface SystemInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  state?: InputState;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export const SystemInput = forwardRef<HTMLInputElement, SystemInputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      state = "default",
      icon,
      suffix,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedState = error ? "error" : state;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-caption-md font-medium text-stone">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mute group-focus-within:text-volt transition-colors duration-300 z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled || resolvedState === "loading"}
            style={{
              paddingLeft: icon ? "2.75rem" : undefined,
              paddingRight: suffix ? "2.75rem" : undefined,
            }}
            className={cn(
              "system-input",
              resolvedState === "error" && "system-input-error",
              resolvedState === "success" && "system-input-success",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {suffix}
            </div>
          )}
          {resolvedState === "loading" && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-volt animate-spin" />
          )}
        </div>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-caption-sm text-sale"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-caption-sm text-mute"
            >
              {hint}
            </motion.p>
          ) : resolvedState === "success" ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-caption-sm text-success"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              验证通过
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);
SystemInput.displayName = "SystemInput";

export interface SystemTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const SystemTextarea = forwardRef<HTMLTextAreaElement, SystemTextareaProps>(
  ({ className, label, hint, error, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="block text-caption-md font-medium text-stone">{label}</label>
      )}
      <textarea
        ref={ref}
        className={cn("system-input min-h-[100px] resize-y py-3", error && "system-input-error", className)}
        {...props}
      />
      {error && <p className="text-caption-sm text-sale">{error}</p>}
      {hint && !error && <p className="text-caption-sm text-mute">{hint}</p>}
    </div>
  )
);
SystemTextarea.displayName = "SystemTextarea";

export interface SystemSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const SystemSelect = forwardRef<HTMLSelectElement, SystemSelectProps>(
  ({ className, label, hint, error, children, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="block text-caption-md font-medium text-stone">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          "system-input appearance-none cursor-pointer pr-10",
          error && "system-input-error",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-caption-sm text-sale">{error}</p>}
      {hint && !error && <p className="text-caption-sm text-mute">{hint}</p>}
    </div>
  )
);
SystemSelect.displayName = "SystemSelect";
