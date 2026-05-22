import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-[#d2d2d7] dark:border-[#48484a]",
        "bg-[#f5f5f7] dark:bg-[#1c1c1e] px-4 text-[15px]",
        "text-apple-text dark:text-apple-text",
        "placeholder:text-apple-text-secondary",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
