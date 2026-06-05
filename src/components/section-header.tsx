import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  /** Section badge/pill label shown above the title */
  label?: string;
  /** Main heading */
  title: string;
  /** Accent/emphasized part of the title (rendered with gradient text) */
  titleAccent?: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Extra content below subtitle */
  children?: ReactNode;
  /** Alignment */
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  titleAccent,
  subtitle,
  children,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-[680px]",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span className="inline-block pill-badge-gradient mb-5">
          {label}
        </span>
      )}

      <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.025em] leading-[1.12] text-apple-text dark:text-white mb-4">
        {titleAccent ? (
          <>
            {title}
            <br />
            <span className="text-shimmer">{titleAccent}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p className="text-[clamp(1rem,1.5vw,1.125rem)] text-apple-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
