import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,color,box-shadow,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent-hover",
        secondary:
          "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        ghost: "text-muted hover:text-fg hover:bg-surface-2",
        danger: "bg-fail text-fail-fg hover:opacity-90",
        pass: "bg-pass text-pass-fg hover:opacity-90",
        outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
        md: "h-11 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-12 px-5 text-base rounded-[var(--radius-md)] min-h-11",
        icon: "size-11 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "accent" | "pass" | "fail" | "warn" }) {
  const tones = {
    neutral: "bg-surface-2 text-muted",
    accent: "bg-accent/15 text-accent",
    pass: "bg-pass/15 text-pass",
    fail: "bg-fail/15 text-fail",
    warn: "bg-warn/15 text-warn",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Meter({
  value,
  tone = "accent",
  className,
}: {
  value: number;
  tone?: "accent" | "pass" | "fail";
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const color = tone === "pass" ? "bg-pass" : tone === "fail" ? "bg-fail" : "bg-accent";
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface-2", className)}>
      <div className={cn("h-full rounded-full", color)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
      {children}
    </p>
  );
}
