import Link from "next/link";

import type { SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { formatSpentMinutes } from "@/shared/lib/format";
import { Surface } from "@/shared/ui";

import { firstReviewTarget } from "../model/review-target";

type ResultsTableProps = {
  attemptId: number;
  sections: SectionResult[];
};

export function ResultsTable({ attemptId, sections }: ResultsTableProps) {
  return (
    <Surface className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line font-mono text-[10px] tracking-[1.4px] text-ink-faint uppercase">
            <th className="px-6 py-3 font-normal">Блок</th>
            <th className="px-4 py-3 font-normal">Верно</th>
            <th className="px-4 py-3 font-normal">Баллы</th>
            <th className="px-4 py-3 font-normal">Точность</th>
            <th className="px-4 py-3 font-normal">Время</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => {
            const target = firstReviewTarget(section);
            return (
              <tr key={section.id} className="border-b border-line last:border-b-0">
                <td className="px-6 py-3.5 text-sm font-medium text-ink">{section.subject.name[UI_LANGUAGE]}</td>
                <td className="px-4 py-3.5 font-mono text-[13px] whitespace-nowrap text-ink-muted">
                  {section.correctCount} / {section.questionCount}
                </td>
                <td className="px-4 py-3.5 font-mono text-[13px] whitespace-nowrap text-ink">
                  {section.score} / {section.maxScore}
                </td>
                <td className="w-[28%] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-ink-soft" style={{ width: `${section.accuracyPercent}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono text-xs text-ink-muted">{section.accuracyPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs whitespace-nowrap text-ink-faint">
                  {formatSpentMinutes(section.timeSpentSeconds, UI_LANGUAGE)}
                </td>
                <td className="px-6 py-3.5 text-right">
                  {target !== null ? (
                    <Link href={routes.examReview(attemptId, target)} className="text-[13px] font-medium text-ink-soft hover:underline">
                      Разбор →
                    </Link>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Surface>
  );
}
