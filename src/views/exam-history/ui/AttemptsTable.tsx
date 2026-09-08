import Link from "next/link";

import type { AttemptHistoryItem } from "@/entities/attempt";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import {
  formatHoursMinutes,
  formatShortDate,
  pluralize,
} from "@/shared/lib/format";
import { Surface } from "@/shared/ui";

type AttemptsTableProps = {
  items: AttemptHistoryItem[];
};

function title(item: AttemptHistoryItem): string {
  return `Пробное ЕНТ №${item.number}`;
}

function subjectsLabel(item: AttemptHistoryItem): string {
  const subjects = item.subjects.length;
  return `${subjects} ${pluralize(subjects, ["предмет", "предмета", "предметов"])} · ${item.questionCount} ${pluralize(item.questionCount, ["вопрос", "вопроса", "вопросов"])}`;
}

function timeLabel(item: AttemptHistoryItem): string {
  if (item.status === "in_progress") {
    return "Идёт";
  }
  return formatHoursMinutes(item.timeSpentSeconds);
}

function action(item: AttemptHistoryItem): { href: string; label: string } {
  return item.status === "in_progress"
    ? { href: routes.exam(item.id), label: "Продолжить →" }
    : { href: routes.examResults(item.id), label: "Разбор →" };
}

export function AttemptsTable({ items }: AttemptsTableProps) {
  return (
    <>
      <Surface className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-canvas font-mono text-[10px] tracking-[1.2px] text-ink-faint uppercase">
              <th className="px-6 py-3 font-normal">Дата</th>
              <th className="px-4 py-3 font-normal">Тест</th>
              <th className="px-4 py-3 font-normal">Предметы</th>
              <th className="px-4 py-3 font-normal">Баллы</th>
              <th className="w-[22%] px-4 py-3 font-normal">Точность</th>
              <th className="px-4 py-3 font-normal">Время</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isActive = item.status === "in_progress";
              const link = action(item);
              return (
                <tr
                  key={item.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-6 py-[15px] font-mono text-[13px] whitespace-nowrap text-ink-muted">
                    {formatShortDate(item.startedAt)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-[15px] text-sm font-medium whitespace-nowrap",
                      isActive ? "text-ink-faint" : "text-ink",
                    )}
                  >
                    {title(item)}
                  </td>
                  <td className="px-4 py-[15px] text-[13px] text-ink-faint">
                    {subjectsLabel(item)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-[15px] font-mono text-[13px] whitespace-nowrap",
                      isActive ? "text-ink-faint" : "text-ink",
                    )}
                  >
                    {isActive ? "—" : `${item.totalScore} / ${item.maxScore}`}
                  </td>
                  <td className="px-4 py-[15px]">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                        {isActive ? null : (
                          <div
                            className="h-full rounded-full bg-ink-soft"
                            style={{ width: `${item.accuracyPercent}%` }}
                          />
                        )}
                      </div>
                      <span className="w-10 text-right font-mono text-xs text-ink-muted">
                        {isActive ? "—" : `${item.accuracyPercent}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-[15px] font-mono text-xs whitespace-nowrap text-ink-faint">
                    {timeLabel(item)}
                  </td>
                  <td className="px-6 py-[15px] text-right whitespace-nowrap">
                    <Link
                      href={link.href}
                      className="text-[13px] font-medium text-ink-soft hover:underline"
                    >
                      {link.label}
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
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-ink-faint" : "text-ink",
                  )}
                >
                  {title(item)}
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  {formatShortDate(item.startedAt)}
                </span>
              </div>
              <p className="text-[13px] text-ink-faint">
                {subjectsLabel(item)}
              </p>
              <div className="flex items-center justify-between gap-3 font-mono text-[13px]">
                <span className={isActive ? "text-ink-faint" : "text-ink"}>
                  {isActive ? "—" : `${item.totalScore} / ${item.maxScore}`}
                </span>
                <span className="text-ink-muted">
                  {isActive ? "—" : `${item.accuracyPercent}%`}
                </span>
                <span className="text-xs text-ink-faint">
                  {timeLabel(item)}
                </span>
              </div>
              <Link
                href={link.href}
                className="text-[13px] font-medium text-ink-soft hover:underline"
              >
                {link.label}
              </Link>
            </Surface>
          );
        })}
      </ul>
    </>
  );
}
