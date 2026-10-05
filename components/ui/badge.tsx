import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary-light text-text-primary",
        secondary: "bg-background-muted text-text-secondary",
        outline: "border border-border text-text-secondary",
        danger: "bg-danger-light text-danger",
        success: "bg-success-light text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
