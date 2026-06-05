import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BrandSectionHeaderProps {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}

export function BrandSectionHeader({
  label,
  title,
  titleAccent,
  subtitle,
  align = "center",
  dark = false,
  className,
  children,
}: BrandSectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-[720px]",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span
          className={cn(
            "inline-block mb-4 px-4 py-1.5 rounded-pill text-caption-sm font-medium tracking-wide uppercase",
            dark
              ? "border border-white/20 text-stone bg-white/5"
              : "border border-hairline text-stone bg-cloud"
          )}
        >
          {label}
        </span>
      )}

      <h2
        className={cn(
          "text-[clamp(2rem,5vw,3rem)] font-medium tracking-tight leading-[1.08] mb-4",
          dark ? "text-white" : "text-ink"
        )}
      >
            {titleAccent ? (
          <>
            {title}
            <br />
            <span className="text-volt">{titleAccent}</span>
          </>
        ) : (
          title
        )}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-body-md max-w-[540px] leading-relaxed",
            align === "center" && "mx-auto",
            dark ? "text-stone" : "text-stone"
          )}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
