'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f5f5f7' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#1d1d1f' }}>
              应用出现异常
            </h2>
            <p style={{ fontSize: 14, color: '#86868b', marginBottom: 24, lineHeight: 1.6 }}>
              页面加载时遇到错误，请刷新后重试。
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                border: 'none',
                background: '#0071e3',
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              刷新页面
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
