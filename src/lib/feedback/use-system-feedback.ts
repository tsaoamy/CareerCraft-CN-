"use client";

import { useCallback } from "react";
import { useToast } from "@/components/system/toast";
import { feedback, type FeedbackKey } from "./messages";
import { useLocale } from "@/lib/i18n/locale-context";

export function useSystemFeedback() {
  const { success, error, info, processing, warning } = useToast();
  const { locale } = useLocale();
  const lang = locale === "en" ? "en" : "zh";

  const msg = useCallback((key: FeedbackKey) => feedback(key, lang), [lang]);

  return {
    success: (key: FeedbackKey) => success(msg(key)),
    error: (key: FeedbackKey) => error(msg(key)),
    info: (key: FeedbackKey) => info(msg(key)),
    processing: (key: FeedbackKey = "processing") => processing(msg(key)),
    raw: { success, error, info, processing, warning },
    t: msg,
  };
}

export async function runAsyncAction<T>(
  fn: () => Promise<T>,
  handlers: {
    onSuccess?: (result: T) => void;
    onError?: (err: unknown) => void;
    successKey?: FeedbackKey;
    errorKey?: FeedbackKey;
    feedback: ReturnType<typeof useSystemFeedback>;
  }
): Promise<T | null> {
  const { feedback: fb, successKey, errorKey, onSuccess, onError } = handlers;
  fb.processing();
  try {
    const result = await fn();
    if (successKey) fb.success(successKey);
    onSuccess?.(result);
    return result;
  } catch (err) {
    fb.error(errorKey ?? "actionFailed");
    onError?.(err);
    return null;
  }
}
