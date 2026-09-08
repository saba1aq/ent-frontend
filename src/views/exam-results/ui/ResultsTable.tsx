import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { formatSpentMinutes } from "@/shared/lib/format";
import { SectionLabel, Surface } from "@/shared/ui";

import { firstReviewTarget } from "../model/review-target";

const PROFILE_SECTION_SLOTS = 2;

type ResultsTableProps = {
  attemptId: number;
  sections: SectionResult[];
};

export function ResultsTable({ attemptId, sections }: ResultsTableProps) {
  const firstProfileIndex = sections.length - PROFILE_SECTION_SLOTS;

  return (
    <Surface className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="px-6 py-3.5 font-normal">
              <SectionLabel as="span">Блок</SectionLabel>
            </th>
            <th className="px-4 py-3.5 text-right font-normal">
              <SectionLabel as="span">Верно</SectionLabel>
            </th>
            <th className="px-4 py-3.5 text-right font-normal">
              <SectionLabel as="span">Баллы</SectionLabel>
            </th>
            <th className="w-[30%] px-4 py-3.5 font-normal">
              <SectionLabel as="span">Точность</SectionLabel>
            </th>
            <th className="px-4 py-3.5 text-right font-normal">
              <SectionLabel as="span">Время</SectionLabel>
            </th>
            <th className="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {sections.map((section, index) => {
            const target = firstReviewTarget(section);
            const isProfile = index >= firstProfileIndex;
            return (
              <tr key={section.id} className="border-b border-line last:border-b-0">
                <td className="px-6 py-4 text-sm font-medium text-ink">{section.subject.name[UI_LANGUAGE]}</td>
                <td className="px-4 py-4 text-right text-[13px] whitespace-nowrap text-ink-soft">
                  {section.correctCount}
                  <span className="text-ink-faint"> / {section.questionCount}</span>
                </td>
                <td className="px-4 py-4 text-right text-[13px] whitespace-nowrap text-ink">
                  {section.score}
                  <span className="text-ink-faint"> / {section.maxScore}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
                      <div
                        className={cn("h-full rounded-full", isProfile ? "bg-accent" : "bg-ink-faint")}
                        style={{ width: `${section.accuracyPercent}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[13px] text-ink-soft">{section.accuracyPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right text-[13px] whitespace-nowrap text-ink-faint">
                  {formatSpentMinutes(section.timeSpentSeconds, UI_LANGUAGE)}
                </td>
                <td className="px-6 py-4 text-right">
                  {target === null ? null : (
                    <Link
                      href={routes.examReview(attemptId, target)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:text-accent"
                    >
                      Разбор
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Surface>
  );
}
