import { cn } from "@/shared/lib/cn";

type SectionLabelTone = "faint" | "muted" | "soft";

type SectionLabelProps = {
  as?: "p" | "h2" | "h3" | "span" | "dt";
  tone?: SectionLabelTone;
  className?: string;
  children: React.ReactNode;
};

const TONE_CLASSES: Record<SectionLabelTone, string> = {
  faint: "text-ink-faint",
  muted: "text-ink-muted",
  soft: "text-ink-soft",
};

export function SectionLabel({ as = "p", tone = "faint", className, children }: SectionLabelProps) {
  const Component = as;
  return (
    <Component className={cn("text-[11px] font-semibold tracking-[0.09em] uppercase", TONE_CLASSES[tone], className)}>
      {children}
    </Component>
  );
}
