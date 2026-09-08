"use client";

import { Check, Flame } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";
import { SectionLabel, Surface } from "@/shared/ui";

import type { Streak } from "../model/types";

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

type StreakCardProps = {
  streak: Streak;
  className?: string;
};

export function StreakCard({ streak, className }: StreakCardProps) {
  const isAlive = streak.currentDays > 0;
  const isRecord = isAlive && streak.currentDays >= streak.bestDays;

  return (
    <Surface
      className={cn(
        "animate-enter flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-7",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full ring-1",
            isAlive ? "bg-accent-soft text-accent ring-accent-line" : "bg-sunken text-ink-faint ring-line",
          )}
        >
          <Flame className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <SectionLabel tone="soft">Серия подготовки</SectionLabel>
          <p className="font-display text-[26px] leading-none font-medium tracking-[-0.6px] text-ink-strong">
            {streak.currentDays} {pluralize(streak.currentDays, ["день", "дня", "дней"])}
          </p>
          <p className="text-[13px] text-ink-muted">{describe(streak, isAlive, isRecord)}</p>
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        {streak.week.map((day) => (
          <DayMark key={day.day} iso={day.day} isActive={day.isActive} />
        ))}
      </div>
    </Surface>
  );
}

function DayMark({ iso, isActive }: { iso: string; isActive: boolean }) {
  const date = new Date(`${iso}T00:00:00`);
  const label = WEEKDAYS[date.getDay()];

  return (
    <div className="flex w-8 flex-col items-center gap-1.5">
      <span
        aria-hidden
        className={cn(
          "flex size-8 items-center justify-center rounded-md ring-1",
          isActive ? "bg-accent text-white ring-accent" : "bg-surface text-transparent ring-line-strong",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="text-[11px] text-ink-faint">{label}</span>
    </div>
  );
}

function describe(streak: Streak, isAlive: boolean, isRecord: boolean): string {
  if (!isAlive) {
    return streak.bestDays > 0
      ? `Серия сгорела. Лучшая была ${streak.bestDays} ${pluralize(streak.bestDays, ["день", "дня", "дней"])} — начните новую сегодня.`
      : "Позанимайтесь сегодня, чтобы начать серию.";
  }
  if (!streak.activeToday) {
    return "Сегодня ещё не занимались — серия сгорит после полуночи.";
  }
  if (isRecord) {
    return "Это ваш личный рекорд. Не прерывайте.";
  }
  return `Лучшая серия — ${streak.bestDays} ${pluralize(streak.bestDays, ["день", "дня", "дней"])}.`;
}
