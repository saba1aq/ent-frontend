import { cn } from "@/shared/lib/cn";

type SectionLabelProps = {
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  children: React.ReactNode;
};

export function SectionLabel({ as = "p", className, children }: SectionLabelProps) {
  const Component = as;
  return (
    <Component className={cn("font-mono text-[10px] tracking-[1.4px] text-ink-faint uppercase", className)}>
      {children}
    </Component>
  );
}
