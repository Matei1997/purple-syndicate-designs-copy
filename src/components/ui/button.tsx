import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "ghost" | "glass" | "neon";
type Size = "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40",
      glass: "glass text-foreground hover:border-primary/40",
      neon: "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border border-border/40 font-heading font-semibold transition-all",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
