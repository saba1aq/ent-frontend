"use client";

import { Check, Flame } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";
import { SectionLabel, Surface } from "@/shared/ui";

import type { Streak, StreakDay } from "../model/types";

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
        "animate-enter flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-7",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            isAlive ? "bg-accent-soft text-accent" : "bg-sunken text-ink-faint",
          )}
        >
          <Flame className="size-5.5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <SectionLabel tone="soft">Серия подготовки</SectionLabel>
          <p className="font-display text-[26px] leading-none font-medium tracking-[-0.6px] text-ink-strong">
            {streak.currentDays}
            <span className="ml-1.5 text-[15px] font-normal tracking-normal text-ink-muted">
              {pluralize(streak.currentDays, ["день", "дня", "дней"])} подряд
            </span>
          </p>
          <p className={cn("text-[13px]/[19px]", isAlive && !streak.activeToday ? "text-accent-strong" : "text-ink-muted")}>
            {describe(streak, isAlive, isRecord)}
          </p>
        </div>
      </div>

      <div className="flex items-start">
        {streak.week.map((day, index) => (
          <Fragment key={day.day}>
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "mt-[15px] h-0.5 w-2.5 shrink-0",
                  day.isActive && streak.week[index - 1].isActive ? "bg-accent" : "bg-line",
                )}
              />
            ) : null}
            <DayMark day={day} isToday={index === streak.week.length - 1} />
          </Fragment>
        ))}
      </div>
    </Surface>
  );
}

function DayMark({ day, isToday }: { day: StreakDay; isToday: boolean }) {
  const date = new Date(`${day.day}T00:00:00`);
  const label = WEEKDAYS[date.getDay()];

  return (
    <div className="flex w-8 flex-col items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          day.isActive ? "bg-accent text-white" : "bg-sunken text-transparent",
          isToday && !day.isActive ? "outline-2 outline-dashed outline-offset-2 outline-line-strong" : null,
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className={cn("text-[11px]", isToday ? "font-semibold text-ink-soft" : "text-ink-faint")}>{label}</span>
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
  const left = streak.bestDays - streak.currentDays;
  return `Лучшая серия — ${streak.bestDays} ${pluralize(streak.bestDays, ["день", "дня", "дней"])}. До рекорда ${left} ${pluralize(left, ["день", "дня", "дней"])}.`;
}
