/** Map known server/client error strings to locale-aware messages */
import type { Locale } from './translations';

const ERROR_MAP: Record<string, { en: string; zh: string }> = {
  '简历内容过短，请上传包含更多信息的文件': {
    en: 'Resume content is too short. Please upload a file with more information.',
    zh: '简历内容过短，请上传包含更多信息的文件',
  },
  '简历解析失败': {
    en: 'Resume parsing failed.',
    zh: '简历解析失败',
  },
  '不支持的格式，请上传 PDF、Word（.doc/.docx）或 .txt / .md 文件': {
    en: 'Unsupported format. Please upload PDF, Word (.doc/.docx), or .txt / .md.',
    zh: '不支持的格式，请上传 PDF、Word（.doc/.docx）或 .txt / .md 文件',
  },
  '请选择要上传的简历文件': {
    en: 'Please select a resume file to upload.',
    zh: '请选择要上传的简历文件',
  },
  '上传失败': { en: 'Upload failed', zh: '上传失败' },
  '分析失败，请重试': { en: 'Analysis failed. Please try again.', zh: '分析失败，请重试' },
  '生成失败，请重试': { en: 'Generation failed. Please try again.', zh: '生成失败，请重试' },
  '网络错误，请稍后重试': { en: 'Network error. Please try again later.', zh: '网络错误，请稍后重试' },
};

export function resolveErrorMessage(message: string, locale: Locale, fallback?: string): string {
  const mapped = ERROR_MAP[message];
  if (mapped) return mapped[locale];
  if (locale === 'en' && /[\u4e00-\u9fff]/.test(message)) {
    return fallback ?? 'Something went wrong. Please try again.';
  }
  return message;
}

/** Replace {key} placeholders in i18n templates */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}
