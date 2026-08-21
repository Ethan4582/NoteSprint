import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent)] text-white shadow hover:opacity-90",
        secondary:
          "border-transparent bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]",
        outline: "text-[var(--text-primary)] border-[var(--border)]",
        success:
          "border-transparent bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
        warning:
          "border-transparent bg-amber-500/20 text-amber-500 border border-amber-500/30",
        error:
          "border-transparent bg-rose-500/20 text-rose-500 border border-rose-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
