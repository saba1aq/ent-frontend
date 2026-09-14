"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { describeError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { pluralize } from "@/shared/lib/format";
import { showToast } from "@/shared/lib/toast-store";
import { Button, PageContainer, SectionLabel, Segmented, Spinner, Surface } from "@/shared/ui";

import { fetchLeaderboard } from "../api/leaderboard-api";
import type { Leaderboard, LeaderboardPeriod, LeaderboardRow } from "../model/types";

const PERIOD_OPTIONS = [
  { value: "all" as const, label: "За всё время" },
  { value: "week" as const, label: "7 дней" },
  { value: "today" as const, label: "Сегодня" },
];

const EMPTY_TEXTS: Record<LeaderboardPeriod, string> = {
  all: "Рейтинг пустой — станьте первым, кто завершит пробник.",
  week: "На этой неделе пробников пока никто не сдавал.",
  today: "Сегодня ещё никто не сдавал пробник. Хороший шанс возглавить день.",
};

export function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [failedPeriod, setFailedPeriod] = useState<LeaderboardPeriod | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLeaderboard(period)
      .then((loaded) => {
        if (!cancelled) {
          setBoard(loaded);
        }
      })
      .catch((caught: unknown) => {
        if (cancelled || caught instanceof NotAuthenticatedError) {
          return;
        }
        showToast(describeError(caught, "Не удалось загрузить рейтинг."));
        setFailedPeriod(period);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const isLoading = board?.period !== period && failedPeriod !== period;

  const rows = board?.rows ?? [];
  const me = board?.me ?? null;
  const isMeListed = rows.some((row) => row.isMe);

  return (
    <PageContainer>
      <header className="animate-enter flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <SectionLabel>Рейтинг</SectionLabel>
          <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.9px] text-ink-strong lg:text-[40px]">
            Кто впереди
          </h1>
          <p className="max-w-[560px] text-[15px]/[24px] text-ink-muted">
            Место в рейтинге считается по лучшему баллу за выбранный период. Серия — сколько дней подряд вы завершаете
            пробники.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Segmented value={period} options={PERIOD_OPTIONS} onChange={setPeriod} ariaLabel="Период рейтинга" />
          {board ? (
            <p className="text-[13px] text-ink-faint">
              {board.totalParticipants} {pluralize(board.totalParticipants, ["участник", "участника", "участников"])}
            </p>
          ) : null}
        </div>
      </header>

      {me ? <MyPlace row={me} isListed={isMeListed} /> : null}

      {isLoading && board === null ? (
        <p className="flex items-center gap-2.5 py-16 text-sm text-ink-muted">
          <Spinner className="text-ink-faint" />
          Считаем рейтинг…
        </p>
      ) : rows.length === 0 ? (
        <Surface className="flex flex-col items-start gap-5 p-6 sm:p-9">
          <p className="max-w-[520px] text-base/7 text-ink-soft">{EMPTY_TEXTS[period]}</p>
          <Button as={Link} href={routes.examSetup} size="lg">
            Новый пробник
          </Button>
        </Surface>
      ) : (
        <LeaderboardTable rows={rows} />
      )}
    </PageContainer>
  );
}

function MyPlace({ row, isListed }: { row: LeaderboardRow; isListed: boolean }) {
  return (
    <Surface className="animate-enter flex flex-wrap items-center gap-x-10 gap-y-5 p-5 ring-accent-line sm:px-7">
      <div className="flex flex-col gap-1">
        <SectionLabel>Ваше место</SectionLabel>
        <p className="font-display text-[28px] leading-none font-medium tracking-[-0.6px] text-ink">#{row.rank}</p>
      </div>
      <Stat label="Лучший балл" value={`${row.bestScore} / ${row.maxScore || 140}`} />
      <Stat label="Средний балл" value={String(row.averageScore)} />
      <Stat label="Пробников" value={String(row.attemptCount)} />
      <Stat label="Серия" value={formatStreak(row.streakDays)} />
      {isListed ? null : <p className="text-[13px] text-ink-muted">Вы пока за пределами таблицы — ещё один пробник поднимет выше.</p>}
    </Surface>
  );
}

function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <>
      <Surface className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <Th className="w-20 pl-6">Место</Th>
              <Th>Ученик</Th>
              <Th className="text-right">Лучший балл</Th>
              <Th className="text-right">Средний</Th>
              <Th className="text-right">Пробников</Th>
              <Th className="pr-6 text-right">Серия</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.rank}
                className={cn(
                  "border-b border-line last:border-b-0",
                  row.isMe
                    ? "[&>td]:bg-accent-soft [&>td:first-child]:shadow-[inset_3px_0_0_0_var(--color-accent)]"
                    : null,
                )}
              >
                <td className={cn("py-4 pl-6 text-sm font-semibold", row.isMe ? "text-accent-strong" : "text-ink-faint")}>
                  {row.rank}
                </td>
                <td className="py-4 pr-4">
                  <span className={cn("text-sm", row.isMe ? "font-semibold text-ink-strong" : "font-medium text-ink")}>
                    {row.displayName}
                  </span>
                </td>
                <td className={cn("py-4 pr-4 text-right text-sm", row.isMe ? "font-semibold text-ink-strong" : "font-medium text-ink")}>
                  {row.bestScore}
                  <span className="font-normal text-ink-faint"> / {row.maxScore || 140}</span>
                </td>
                <td className={cn("py-4 pr-4 text-right text-[13px]", row.isMe ? "text-ink-soft" : "text-ink-muted")}>
                  {row.averageScore}
                </td>
                <td className={cn("py-4 pr-4 text-right text-[13px]", row.isMe ? "text-ink-soft" : "text-ink-muted")}>
                  {row.attemptCount}
                </td>
                <td className="py-4 pr-6 text-right">
                  <StreakBadge days={row.streakDays} isMe={row.isMe} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>

      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <Surface
            key={row.rank}
            as="li"
            className={cn(
              "flex flex-col gap-3 p-4",
              row.isMe ? "border-l-[3px] border-accent bg-accent-soft ring-accent-line" : null,
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn("text-sm font-semibold", row.isMe ? "text-accent-strong" : "text-ink-faint")}>{row.rank}</span>
              <span className={cn("flex-1 text-sm", row.isMe ? "font-semibold text-ink-strong" : "font-medium text-ink")}>
                {row.displayName}
              </span>
              <StreakBadge days={row.streakDays} isMe={row.isMe} />
            </div>
            <div
              className={cn(
                "flex items-center justify-between gap-3 border-t pt-3 text-[13px]",
                row.isMe ? "border-accent-line" : "border-line",
              )}
            >
              <span className={row.isMe ? "text-white" : "text-ink"}>
                {row.bestScore}
                <span className="font-normal text-ink-faint"> / {row.maxScore || 140}</span>
              </span>
              <span className={row.isMe ? "text-ink-soft" : "text-ink-muted"}>средний {row.averageScore}</span>
              <span className="text-ink-faint">
                {row.attemptCount} {pluralize(row.attemptCount, ["пробник", "пробника", "пробников"])}
              </span>
            </div>
          </Surface>
        ))}
      </ul>
    </>
  );
}

function StreakBadge({ days, isMe }: { days: number; isMe: boolean }) {
  if (days === 0) {
    return <span className="text-[13px] text-ink-faint">—</span>;
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-[13px]", isMe ? "font-semibold text-ink-strong" : "font-medium text-ink")}>
      <Flame className={cn("size-3.5", isMe ? "text-accent" : "text-ink-muted")} aria-hidden />
      {days} {pluralize(days, ["день", "дня", "дней"])}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <SectionLabel>{label}</SectionLabel>
      <p className="text-[17px] font-medium text-ink">{value}</p>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-4 py-3.5", className)}>
      <SectionLabel as="span">{children}</SectionLabel>
    </th>
  );
}

function formatStreak(days: number): string {
  return days === 0 ? "—" : `${days} ${pluralize(days, ["день", "дня", "дней"])}`;
}
