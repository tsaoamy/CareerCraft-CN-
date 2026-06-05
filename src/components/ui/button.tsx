import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "volt";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-pill",
          "transition-all duration-300 ease-brand select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2",
          "active:scale-[0.96]",
          "disabled:opacity-40 disabled:pointer-events-none",
          {
            "h-10 px-5 text-caption-sm gap-1.5": size === "sm",
            "h-12 px-8 text-body-md gap-2": size === "md",
            "h-14 px-10 text-heading-md gap-2.5": size === "lg",
          },
          {
            "bg-ink text-white hover:bg-charcoal": variant === "primary",
            "bg-cloud text-ink hover:bg-hairline-soft": variant === "secondary",
            "bg-transparent border border-hairline text-ink hover:bg-ink hover:text-white":
              variant === "outline",
            "bg-transparent text-mute hover:text-ink hover:bg-cloud": variant === "ghost",
            "bg-sale text-white hover:opacity-90": variant === "destructive",
            "bg-volt text-ink font-semibold hover:bg-volt-dim": variant === "volt",
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
