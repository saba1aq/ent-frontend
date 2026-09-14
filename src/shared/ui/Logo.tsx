import { cn } from "@/shared/lib/cn";

type LogoSize = "sm" | "md" | "lg";

type LogoOwnProps<T extends React.ElementType> = {
  as?: T;
  size?: LogoSize;
  className?: string;
};

type LogoProps<T extends React.ElementType> = LogoOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof LogoOwnProps<T>>;

const SIZE_CLASSES: Record<LogoSize, { gap: string; mark: string; word: string }> = {
  sm: { gap: "gap-2", mark: "size-8", word: "text-[17px]" },
  md: { gap: "gap-2.5", mark: "size-10", word: "text-[21px]" },
  lg: { gap: "gap-3.5", mark: "size-16", word: "text-[34px]" },
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-8 shrink-0", className)}>
      <path d="M8 14v4a6 6 0 0 0 12 0v-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 15V10" className="stroke-accent" strokeWidth="4" />
      <path d="M20 5 25 11H15z" className="fill-accent stroke-accent" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function LogoWord({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-[-0.055em]", className)}>
      <span className="text-accent">up</span>study
    </span>
  );
}

export function Logo<T extends React.ElementType = "span">({ as, size = "sm", className, ...rest }: LogoProps<T>) {
  const Component = (as ?? "span") as React.ElementType;
  const scale = SIZE_CLASSES[size];

  return (
    <Component aria-label="upstudy" className={cn("flex items-center text-ink-strong", scale.gap, className)} {...rest}>
      <LogoMark className={scale.mark} />
      <LogoWord className={scale.word} />
    </Component>
  );
}
