/**
 * 代码题运行器 — 浏览器内 JavaScript 测试用例校验
 */

import type { CodeConfig, CodeTestResult } from '@/types/interview';

function serialize(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** 运行 JavaScript 代码题测试用例 */
export function runJavaScriptTests(userCode: string, config: CodeConfig): CodeTestResult[] {
  const results: CodeTestResult[] = [];

  for (const tc of config.testCases) {
    try {
      // eslint-disable-next-line no-new-func
      const runner = new Function(
        `${userCode}\nreturn ${tc.invoke};`
      ) as () => unknown;
      const actual = runner();
      const actualStr = serialize(actual);
      const expectedStr = tc.expected.trim();
      const passed = actualStr === expectedStr;

      results.push({
        description: tc.description ?? tc.invoke,
        passed,
        expected: expectedStr,
        actual: actualStr,
      });
    } catch (err) {
      results.push({
        description: tc.description ?? tc.invoke,
        passed: false,
        expected: tc.expected,
        actual: err instanceof Error ? `Error: ${err.message}` : 'Runtime Error',
      });
    }
  }

  return results;
}

/** 根据通过率计算代码题得分 */
export function scoreCodeTests(results: CodeTestResult[]): number {
  if (results.length === 0) return 0;
  const passed = results.filter((r) => r.passed).length;
  const ratio = passed / results.length;
  if (ratio === 1) return 98;
  if (ratio >= 0.66) return 75;
  if (ratio >= 0.33) return 50;
  return Math.max(15, Math.round(ratio * 40));
}

export function runCodeTests(userCode: string, config: CodeConfig): CodeTestResult[] {
  if (config.language === 'javascript') {
    return runJavaScriptTests(userCode, config);
  }
  // Python：暂用字符串包含校验作为轻量 fallback
  return config.testCases.map((tc) => {
    const passed = userCode.includes(tc.expected.replace(/"/g, ''));
    return {
      description: tc.description ?? tc.invoke,
      passed,
      expected: tc.expected,
      actual: passed ? tc.expected : '（Python 在线运行即将支持，请对照预期输出自检）',
    };
  });
}
