"use client";

import { RefreshCw } from "lucide-react";

export function QrCodePlatform({
  platform,
  refreshKey,
  scanState,
  onRefresh,
}: {
  platform: "wechat" | "qq";
  refreshKey: number;
  scanState: string;
  onRefresh: () => void;
}) {
  const isWechat = platform === "wechat";
  const accentColor = isWechat ? "#07c160" : "#12b7f5";
  const bgColor = isWechat ? "#07c160" : "#12b7f5";

  return (
    <div className="relative mx-auto w-[200px]">
      <div
        className="relative w-[200px] h-[200px] rounded-2xl p-3 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}08)`,
          border: `2px solid ${scanState === "waiting" ? accentColor + "25" : accentColor + "50"}`,
        }}
      >
        <div className="w-full h-full rounded-xl bg-white dark:bg-[#1c1c1e] flex items-center justify-center relative overflow-hidden">
          <QrCodePattern key={refreshKey} refreshKey={refreshKey} />

          {/* 中心 Logo */}
          <div
            className="absolute w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: bgColor }}
          >
            {isWechat ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.5 14h-3v-1h1.5v-1.5h-1.25c-.414 0-.75-.336-.75-.75v-2.5c0-.414.336-.75.75-.75h2.75v1h-2v1h1.25c.414 0 .75.336.75.75V16zm2.5 0h-1v-6h1v6z"/>
              </svg>
            )}
          </div>

          {/* 确认遮罩 */}
          {scanState === "confirmed" && (
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {scanState === "waiting" && (
          <button
            type="button"
            onClick={onRefresh}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            title="刷新二维码"
          >
            <RefreshCw className="w-[14px] h-[14px]" />
            点击刷新
          </button>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}

// ─── 模拟二维码图案 ───
function QrCodePattern({ refreshKey }: { refreshKey: number }) {
  const size = 17;
  const seed = refreshKey * 31 + 7;

  const pattern = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const isFinder =
        (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
      if (isFinder) {
        const fx = x < 7 ? x : x > size - 8 ? x - (size - 7) : 0;
        const fy = y < 7 ? y : y > size - 8 ? y - (size - 7) : 0;
        if (fx === 0 || fx === 6 || fy === 0 || fy === 6) return true;
        if (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4) return true;
        return false;
      }
      const cx = Math.floor(size / 2);
      if (Math.abs(x - cx) < 3 && Math.abs(y - cx) < 3) return false;
      const val = (seed * (x * 7 + y * 13 + x * y * 3) + x * 7331 + y * 2719) % 100;
      return val < 42;
    })
  );

  return (
    <div
      className="grid gap-0"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: 160, height: 160 }}
    >
      {pattern.flat().map((filled, i) => (
        <div
          key={i}
          className="transition-colors duration-300"
          style={{
            backgroundColor: filled ? "var(--qr-dot, #1d1d1f)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}
