import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          // Variant styles
          variant === "primary" && "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm hover:shadow-md",
          variant === "secondary" && "bg-white text-brand-primary border border-brand-border hover:bg-brand-light hover:border-brand-secondary shadow-xs",
          variant === "ghost" && "text-brand-muted hover:text-brand-primary hover:bg-brand-light",
          variant === "link" && "text-brand-secondary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
          // Size styles
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          size === "xl" && "px-9 py-4 text-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
