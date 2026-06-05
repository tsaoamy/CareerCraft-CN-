"use client";

import { useLocale } from "@/lib/i18n/locale-context";

/** Hero 标题 — 杂志式层级，中文保持词组换行 */
export function HeroHeadline() {
  const { t, locale } = useLocale();
  const h = t.hero;

  if (locale === "en") {
    return (
      <h1 className="hero-headline mx-auto lg:mx-0">
        <span className="hero-headline-lead block">
          {h.titleLead}{" "}
          <em className="hero-headline-emphasis not-italic">{h.titleEmphasis}</em>
        </span>
        <span className="hero-headline-closing block text-display-hero">
          {h.titleClosing}
        </span>
      </h1>
    );
  }

  return (
    <h1 className="hero-headline mx-auto lg:mx-0">
      <span className="hero-headline-lead block">
        {h.titleLead}
        <span className="hero-headline-emphasis">{h.titleEmphasis}</span>
      </span>
      <span className="hero-headline-closing block text-display-hero">{h.titleClosing}</span>
    </h1>
  );
}
