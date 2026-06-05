"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BrandButton } from "@/components/design-system/brand-button";

interface SystemDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "destructive";
}

export function SystemDialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = "确认",
  cancelLabel = "取消",
  onConfirm,
  variant = "default",
}: SystemDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="system-dialog-overlay absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="system-dialog relative w-full max-w-md p-6 md:p-8"
            role="dialog"
            aria-modal
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-mute hover:text-white transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-heading-lg font-medium text-white pr-8">{title}</h2>
            {description && (
              <p className="text-body-md text-stone mt-2 leading-relaxed">{description}</p>
            )}
            {children && <div className="mt-6">{children}</div>}
            {(onConfirm || cancelLabel) && (
              <div className="flex gap-3 mt-8">
                <BrandButton variant="outline-dark" size="md" onClick={onClose} className="flex-1">
                  {cancelLabel}
                </BrandButton>
                {onConfirm && (
                  <BrandButton
                    variant={variant === "destructive" ? "primary" : "volt"}
                    size="md"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={cn("flex-1", variant === "destructive" && "bg-sale hover:bg-sale/90")}
                  >
                    {confirmLabel}
                  </BrandButton>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
