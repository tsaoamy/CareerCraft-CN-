import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500",
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
