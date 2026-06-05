/**
 * 服务端简历文件解析 — PDF / Word / 纯文本
 * 仅在 API Route (Node.js runtime) 中使用
 */

import path from 'path';
import { pathToFileURL } from 'url';
import { parseResumeContent, normalizeResumeText } from '@/lib/resume-extract';

const MAX_BYTES = 10 * 1024 * 1024;

const SUPPORTED_EXT = ['txt', 'md', 'csv', 'pdf', 'doc', 'docx'] as const;
export type ResumeFileExt = (typeof SUPPORTED_EXT)[number];

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParsePath = path.join(process.cwd(), 'node_modules', 'pdf-parse', 'lib', 'pdf-parse.js');
  const pdfParseUrl = pathToFileURL(pdfParsePath).href;
  const mod = await import(/* webpackIgnore: true */ pdfParseUrl);
  const pdfParse = (mod.default ?? mod) as (data: Buffer) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return (result.text || '').trim();
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || '').trim();
}

async function extractDocText(buffer: Buffer): Promise<string> {
  const WordExtractor = (await import('word-extractor')).default;
  const extractor = new WordExtractor();
  const doc = await extractor.extract(buffer);
  return (doc.getBody() || '').trim();
}

export async function extractTextFromResumeBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  if (buffer.length > MAX_BYTES) {
    throw new Error('文件不能超过 10MB');
  }

  const ext = getExtension(filename);

  if (!SUPPORTED_EXT.includes(ext as ResumeFileExt)) {
    throw new Error('不支持的格式，请上传 PDF、Word（.doc/.docx）或文本文件');
  }

  let text = '';

  if (ext === 'pdf') {
    text = await extractPdfText(buffer);
  } else if (ext === 'docx') {
    text = await extractDocxText(buffer);
  } else if (ext === 'doc') {
    text = await extractDocText(buffer);
  } else {
    text = buffer.toString('utf-8').trim();
    if (!text && ext === 'csv') {
      text = buffer.toString('latin1').trim();
    }
  }

  if (!text || text.replace(/\s/g, '').length < 20) {
    throw new Error(
      '未能从文件中提取到足够文字，请确认文件未加密、非扫描版图片 PDF，或尝试另存为 .docx / .txt'
    );
  }

  return text;
}

export async function parseResumeBuffer(buffer: Buffer, filename: string) {
  const rawText = await extractTextFromResumeBuffer(buffer, filename);
  const text = normalizeResumeText(rawText);
  const parsed = parseResumeContent(text);
  return { text, ...parsed };
}
