import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Badge = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: "default" | "primary" | "accent" | "success" | "warning" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      {
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300": variant === "default",
        "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300": variant === "primary",
        "bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300": variant === "accent",
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300": variant === "success",
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300": variant === "warning",
      },
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
