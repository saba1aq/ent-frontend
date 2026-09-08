import { X } from "lucide-react";
import Link from "next/link";

import { AnswerStatusCell, type AttemptResults, type SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { SectionLabel, Surface } from "@/shared/ui";

type ReviewNavPanelProps = {
  attemptId: string;
  results: AttemptResults;
  currentSection: SectionResult | undefined;
  currentQuestionId: number;
};

export function ReviewNavPanel({ attemptId, results, currentSection, currentQuestionId }: ReviewNavPanelProps) {
  return (
    <Surface as="aside" className="flex w-full flex-col gap-[22px] p-[22px] lg:w-[320px] lg:shrink-0">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>Результат</SectionLabel>
        <span className="font-mono text-sm text-ink">
          {results.totalScore} <span className="text-ink-faint">/ {results.maxScore}</span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <SectionLabel className="mb-2">Блоки теста</SectionLabel>
        {results.sections.map((section) => {
          const isCurrent = section.id === currentSection?.id;
          return (
            <Link
              key={section.id}
              href={routes.examReview(attemptId, section.answers[0]?.id ?? currentQuestionId)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 transition-colors",
                isCurrent ? "bg-sunken outline outline-ink-soft" : "hover:bg-canvas",
              )}
            >
              <span className={cn("flex-1 truncate text-[13px]", isCurrent ? "font-medium text-ink" : "text-ink-muted")}>
                {section.subject.shortName[UI_LANGUAGE]}
              </span>
              <span className={cn("font-mono text-[11px]", isCurrent ? "text-ink-soft" : "text-ink-faint")}>
                {section.correctCount}/{section.questionCount}
              </span>
            </Link>
          );
        })}
      </div>

      {currentSection ? (
        <div className="flex flex-col gap-2.5 border-t border-line pt-[18px]">
          <SectionLabel>
            {currentSection.subject.shortName[UI_LANGUAGE]} · {currentSection.correctCount} из {currentSection.questionCount} верно
          </SectionLabel>
          <div className="grid grid-cols-7 gap-1.5">
            {currentSection.answers.map((answer) => (
              <AnswerStatusCell
                key={answer.id}
                answer={answer}
                href={routes.examReview(attemptId, answer.id)}
                isCurrent={answer.id === currentQuestionId}
                size="md"
              />
            ))}
          </div>
        </div>
      ) : null}

      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-xs text-ink-muted">
        <li className="flex items-center gap-[9px]">
          <span className="size-3.5 rounded-[3px] bg-surface outline outline-line-strong" aria-hidden />
          Верно
        </li>
        <li className="flex items-center gap-[9px]">
          <span className="flex size-3.5 items-center justify-center rounded-[3px] bg-ink" aria-hidden>
            <X className="size-2.5 text-surface" />
          </span>
          Неверно
        </li>
        <li className="flex items-center gap-[9px]">
          <span className="size-3.5 rounded-[3px] bg-canvas outline outline-line-strong" aria-hidden />
          Без ответа
        </li>
      </ul>

      <Link href={routes.examResults(attemptId)} className="text-center text-[13px] font-medium text-ink-soft hover:underline">
        К таблице результатов
      </Link>
    </Surface>
  );
}
