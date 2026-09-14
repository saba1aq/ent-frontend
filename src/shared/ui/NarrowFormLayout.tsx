import Link from "next/link";

import { routes } from "@/shared/config/routes";

import { Logo } from "./Logo";

type NarrowFormLayoutProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function NarrowFormLayout({ children, footer }: NarrowFormLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <Logo as={Link} href={routes.home} size="md" className="press self-center" />
        <div className="animate-enter flex flex-col gap-6 rounded-xl bg-surface p-7 shadow-card ring-1 ring-line sm:p-8">
          {children}
        </div>
        {footer ? <div className="text-center">{footer}</div> : null}
      </div>
    </main>
  );
}
