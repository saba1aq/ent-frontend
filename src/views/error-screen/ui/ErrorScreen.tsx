import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Logo, SectionLabel } from "@/shared/ui";

type ErrorScreenProps = {
  label: string;
  title: string;
  description: string;
  footnote?: string | null;
  children: React.ReactNode;
};

export function ErrorScreen({ label, title, description, footnote, children }: ErrorScreenProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-9 px-5 py-12">
      <Logo as={Link} href={routes.home} size="md" className="press rounded-md" />

      <div data-motion className="stagger flex w-full flex-col items-center gap-3 text-center">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="font-display text-[28px]/[1.15] font-semibold tracking-[-0.6px] text-ink-strong">{title}</h1>
        <p className="max-w-[26rem] text-sm/6 text-ink-muted">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">{children}</div>

      {footnote ? <p className="text-[11px] text-ink-faint">{footnote}</p> : null}
    </main>
  );
}
