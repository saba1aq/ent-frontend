import { Sparkles } from "lucide-react";
import Link from "next/link";

import type { Entitlement } from "@/entities/subscription";
import { routes } from "@/shared/config/routes";
import { pluralize } from "@/shared/lib/format";

function statusLine(entitlement: Entitlement): string {
  if (entitlement.unlimited) {
    return "Пробники без ограничений";
  }
  const left = entitlement.examsLeft ?? 0;
  if (left === 0) {
    return "Пробники закончились";
  }
  return `${left} ${pluralize(left, ["пробник", "пробника", "пробников"])} в этом месяце`;
}

export function SidebarPlan({ entitlement, isCollapsed }: { entitlement: Entitlement; isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <Link
        href={routes.billing}
        title={`${entitlement.planName} — ${statusLine(entitlement)}`}
        aria-label="Подписка"
        className="press-tight flex size-8 items-center justify-center self-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
      >
        <Sparkles className="size-[17px]" aria-hidden />
      </Link>
    );
  }

  return (
    <Link
      href={routes.billing}
      className="press-tight flex items-center gap-2.5 rounded-md px-2.5 py-2 ring-1 ring-line hover:bg-sunken"
    >
      <Sparkles className="size-4 shrink-0 text-accent-strong" aria-hidden />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-medium text-ink-strong">{entitlement.planName}</span>
        <span className="truncate text-[11px] text-ink-faint">{statusLine(entitlement)}</span>
      </span>
    </Link>
  );
}
