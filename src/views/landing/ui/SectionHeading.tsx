import { SectionLabel } from "@/shared/ui";

type SectionHeadingProps = {
  label: string;
  title: string;
  text?: string;
};

export function SectionHeading({ label, title, text }: SectionHeadingProps) {
  return (
    <div className="flex max-w-[680px] flex-col items-start gap-4">
      <SectionLabel as="span" tone="soft" className="rounded-full text-[12px] bg-sunken px-3 py-1.5 ring-1 ring-line">
        {label}
      </SectionLabel>
      <h2 className="font-display text-[32px]/[1.08] font-medium tracking-[-0.8px] text-ink-strong sm:text-[44px]/[1.04] sm:tracking-[-1.2px]">
        {title}
      </h2>
      {text ? <p className="max-w-[580px] text-base/7 text-ink-muted sm:text-[17px]/7">{text}</p> : null}
    </div>
  );
}
