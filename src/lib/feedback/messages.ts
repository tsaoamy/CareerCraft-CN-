/** 统一产品反馈文案 — 未来 AI 系统语言 */
export const FB = {
  saved: "System Updated",
  synced: "Data Synced",
  analysisComplete: "Analysis Complete",
  insightReady: "Insight Ready",
  profileReady: "Profile Initialized",
  resumeGenerated: "Resume Generated",
  uploadComplete: "Upload Complete",
  deleted: "Record Removed",
  copied: "Copied to Clipboard",
  processing: "Processing Insight…",
  connecting: "Establishing Connection…",
  verifySuccess: "Identity Verified — System Access Granted",
  verifyExpired: "Session Expired — Request New Link",
  verifyError: "Verification Failed — Try Again",
  onboardingComplete: "System Ready — Welcome Aboard",
  actionFailed: "Operation Interrupted",
  networkError: "Connection Lost — Retry When Ready",
  generateFailed: "Generation Incomplete",
  uploadFailed: "Upload Failed",
  analysisFailed: "Analysis Incomplete",
  readyToContinue: "Ready to Continue",
} as const;

export const FB_ZH: Record<keyof typeof FB, string> = {
  saved: "系统已更新",
  synced: "数据已同步",
  analysisComplete: "分析完成",
  insightReady: "洞察已就绪",
  profileReady: "档案已初始化",
  resumeGenerated: "简历已生成",
  uploadComplete: "上传完成",
  deleted: "记录已移除",
  copied: "已复制到剪贴板",
  processing: "正在处理洞察…",
  connecting: "正在建立连接…",
  verifySuccess: "身份已确认 — 系统接入成功",
  verifyExpired: "链接已过期 — 请重新获取",
  verifyError: "验证失败 — 请重试",
  onboardingComplete: "系统就绪 — 欢迎加入",
  actionFailed: "操作中断",
  networkError: "连接中断 — 请稍后重试",
  generateFailed: "生成未完成",
  uploadFailed: "上传失败",
  analysisFailed: "分析未完成",
  readyToContinue: "可以继续了",
};

export type FeedbackKey = keyof typeof FB;

export function feedback(key: FeedbackKey, locale: "zh" | "en" = "zh"): string {
  return locale === "zh" ? FB_ZH[key] : FB[key];
}
