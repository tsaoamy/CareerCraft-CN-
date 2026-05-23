"use client";

interface LegalHeroProps {
  title: string;
  subtitle: string;
}

export function LegalHero({ title, subtitle }: LegalHeroProps) {
  return (
    <section className="pt-24 pb-12 px-5 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight text-apple-text dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-[15px] text-apple-text-secondary">{subtitle}</p>
      </div>
    </section>
  );
}
