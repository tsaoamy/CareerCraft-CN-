import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Apple-style base: pill shape, smooth transitions
          "inline-flex items-center justify-center font-medium rounded-full",
          "transition-all duration-250 ease-apple select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue/50 focus-visible:ring-offset-2",
          "active:scale-[0.97]",
          "disabled:opacity-40 disabled:pointer-events-none",
          // Size variants
          {
            "h-9 px-4 text-[13px] gap-1.5": size === "sm",
            "h-11 px-6 text-[15px] gap-2": size === "md",
            "h-[52px] px-8 text-[17px] gap-2.5": size === "lg",
          },
          // Style variants
          {
            "bg-apple-blue text-white hover:bg-[#0077ed] shadow-[0_2px_8px_rgba(0,113,227,0.3)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)]":
              variant === "primary",
          },
          {
            "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text dark:text-apple-text hover:bg-[#e0e0e5] dark:hover:bg-[#3a3a3c]":
              variant === "secondary",
          },
          {
            "bg-transparent border border-[#d2d2d7] dark:border-[#48484a] text-apple-text dark:text-apple-text hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]":
              variant === "outline",
          },
          {
            "bg-transparent text-apple-text-secondary dark:text-apple-text-secondary hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]":
              variant === "ghost",
          },
          {
            "bg-apple-red text-white hover:bg-[#ff2d55] shadow-[0_2px_8px_rgba(255,55,95,0.3)]":
              variant === "destructive",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
