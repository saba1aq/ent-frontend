"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { AttemptHistoryItem } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { formatHoursMinutes, formatShortDate, pluralize } from "@/shared/lib/format";
import { SectionLabel, Surface } from "@/shared/ui";

type AttemptsTableProps = {
  items: AttemptHistoryItem[];
};

function title(item: AttemptHistoryItem): string {
  const profile = item.subjects.filter((subject) => subject.kind === "profile");
  if (profile.length === 0) {
    return `Пробное ЕНТ №${item.number}`;
  }
  return profile.map((subject) => subject.shortName[UI_LANGUAGE]).join(" и ");
}

function questionsLabel(item: AttemptHistoryItem): string {
  return `${item.questionCount} ${pluralize(item.questionCount, ["вопрос", "вопроса", "вопросов"])}`;
}

function timeLabel(item: AttemptHistoryItem): string {
  return item.status === "in_progress" ? "—" : formatHoursMinutes(item.timeSpentSeconds);
}

function action(item: AttemptHistoryItem): { href: string; label: string } {
  return item.status === "in_progress"
    ? { href: routes.exam(item.id), label: "Продолжить" }
    : { href: routes.examResults(item.id), label: "Разбор" };
}

export function AttemptsTable({ items }: AttemptsTableProps) {
  const router = useRouter();

  return (
    <>
      <Surface className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="px-6 py-3.5 font-normal">
                <SectionLabel as="span">Дата</SectionLabel>
              </th>
              <th className="px-4 py-3.5 font-normal">
                <SectionLabel as="span">Профильные предметы</SectionLabel>
              </th>
              <th className="px-4 py-3.5 font-normal">
                <SectionLabel as="span">Вопросов</SectionLabel>
              </th>
              <th className="px-4 py-3.5 text-right font-normal">
                <SectionLabel as="span">Баллы</SectionLabel>
              </th>
              <th className="w-[24%] px-4 py-3.5 font-normal">
                <SectionLabel as="span">Точность</SectionLabel>
              </th>
              <th className="px-4 py-3.5 text-right font-normal">
                <SectionLabel as="span">Время</SectionLabel>
              </th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isActive = item.status === "in_progress";
              const link = action(item);
              return (
                <tr
                  key={item.id}
                  onClick={() => router.push(link.href)}
                  className="cursor-pointer border-b border-line transition-colors duration-150 ease-out last:border-b-0 hover:bg-sunken"
                >
                  <td className="px-6 py-4 text-[13px] whitespace-nowrap text-ink-muted">
                    {formatShortDate(item.startedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-ink">{title(item)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-ink-faint">{questionsLabel(item)}</td>
                  <td className="px-4 py-4 text-right text-[13px] whitespace-nowrap">
                    {isActive ? (
                      <span className="text-ink-faint">—</span>
                    ) : (
                      <span className="text-ink">
                        {item.totalScore}
                        <span className="text-ink-faint"> / {item.maxScore}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                        {isActive ? null : (
                          <div
                            className="h-full rounded-full bg-ink-faint"
                            style={{ width: `${item.accuracyPercent}%` }}
                          />
                        )}
                      </div>
                      <span className={cn("w-9 text-right text-[13px]", isActive ? "text-ink-faint" : "text-ink-soft")}>
                        {isActive ? "—" : `${item.accuracyPercent}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-[13px] whitespace-nowrap text-ink-faint">
                    {timeLabel(item)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:text-accent"
                    >
                      {link.label}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Surface>

      <ul className="flex flex-col gap-3 md:hidden">
        {items.map((item) => {
          const isActive = item.status === "in_progress";
          const link = action(item);
          return (
            <Surface key={item.id} as="li" className="flex flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium text-ink">{title(item)}</span>
                <span className="ml-auto text-xs text-ink-faint">{formatShortDate(item.startedAt)}</span>
              </div>

              <p className="text-[13px] text-ink-faint">{questionsLabel(item)}</p>

              <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-[13px]">
                <span className={isActive ? "text-ink-faint" : "text-ink"}>
                  {isActive ? "—" : `${item.totalScore} / ${item.maxScore}`}
                </span>
                <span className={isActive ? "text-ink-faint" : "text-ink-soft"}>
                  {isActive ? "—" : `${item.accuracyPercent}%`}
                </span>
                <span className="text-ink-faint">{timeLabel(item)}</span>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1.5 font-medium text-ink-soft transition-colors duration-150 ease-out hover:text-accent"
                >
                  {link.label}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </Surface>
          );
        })}
      </ul>
    </>
  );
}
