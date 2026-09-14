import { Check, Flame } from "lucide-react";

import type { Streak } from "@/entities/streak";
import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";

export function SidebarStreak({ streak, isCollapsed }: { streak: Streak; isCollapsed: boolean }) {
  const isAlive = streak.currentDays > 0;
  const days = `${streak.currentDays} ${pluralize(streak.currentDays, ["день", "дня", "дней"])}`;

  if (isCollapsed) {
    return (
      <div
        title={`Серия ${days}`}
        className="flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[11px] font-semibold text-ink-strong"
      >
        <Flame className={cn("size-[18px]", isAlive ? "text-accent" : "text-ink-faint")} aria-hidden />
        {streak.currentDays}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2.5 rounded-lg px-3 py-3", isAlive ? "bg-accent-soft" : "bg-sunken")}>
      <div className="flex items-center gap-2">
        <Flame className={cn("size-[18px] shrink-0", isAlive ? "text-accent" : "text-ink-faint")} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-display text-[13px] font-medium tracking-[-0.1px] text-ink-strong">
            {isAlive ? `Серия ${days}` : "Серии пока нет"}
          </span>
          <span className="truncate text-[11px] text-ink-muted">{hint(streak, isAlive)}</span>
        </div>
      </div>
      <div className="flex gap-1">
        {streak.week.map((day, index) => (
          <span
            key={day.day}
            aria-hidden
            className={cn(
              "flex h-6 flex-1 items-center justify-center rounded-[6px]",
              day.isActive ? "bg-accent text-white" : "bg-surface text-transparent",
              index === streak.week.length - 1 && !day.isActive
                ? "outline-2 outline-dashed outline-offset-[-2px] outline-line-strong"
                : null,
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        ))}
      </div>
    </div>
  );
}

function hint(streak: Streak, isAlive: boolean): string {
  if (!isAlive) {
    return "Начните сегодня";
  }
  if (!streak.activeToday) {
    return "Сегодня ещё пусто";
  }
  if (streak.currentDays >= streak.bestDays) {
    return "Личный рекорд";
  }
  const left = streak.bestDays - streak.currentDays;
  return `До рекорда ${left} ${pluralize(left, ["день", "дня", "дней"])}`;
}
