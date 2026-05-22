import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Badge = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: "default" | "primary" | "accent" | "success" | "warning" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-tight transition-colors",
      {
        "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text dark:text-apple-text":
          variant === "default",
        "bg-[#e8f4fd] dark:bg-[#003366] text-apple-blue":
          variant === "primary",
        "bg-[#f4f1fa] dark:bg-[#2d1445] text-apple-purple":
          variant === "accent",
        "bg-[#e8f8ee] dark:bg-[#0a3622] text-apple-green":
          variant === "success",
        "bg-[#fff5e5] dark:bg-[#3d2900] text-apple-orange":
          variant === "warning",
      },
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

export { Badge };
