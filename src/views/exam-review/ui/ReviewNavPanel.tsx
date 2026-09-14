import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { type AnswerStatus, AnswerStatusCell, type AttemptResults, type SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { SectionLabel, Surface } from "@/shared/ui";

const LEGEND: Array<{ status: AnswerStatus; label: string; swatch: string }> = [
  { status: "correct", label: "Верно", swatch: "bg-correct-soft ring-1 ring-correct/20" },
  { status: "wrong", label: "Неверно", swatch: "bg-wrong-soft ring-1 ring-wrong/20" },
  { status: "empty", label: "Без ответа", swatch: "bg-surface ring-1 ring-line" },
];

type ReviewNavPanelProps = {
  attemptId: string;
  results: AttemptResults;
  currentSection: SectionResult | undefined;
  currentQuestionId: number;
};

export function ReviewNavPanel({ attemptId, results, currentSection, currentQuestionId }: ReviewNavPanelProps) {
  return (
    <Surface as="aside" className="flex w-full flex-col gap-6 p-5 lg:w-[320px] lg:shrink-0">
      <div className="flex flex-col gap-2">
        <SectionLabel>Результат</SectionLabel>
        <span className="font-display text-[34px] leading-none font-medium tracking-[-1px] text-ink-strong">
          {results.totalScore}
          <span className="text-[17px] tracking-[-0.3px] text-ink-faint"> / {results.maxScore}</span>
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <SectionLabel className="mb-2">Блоки теста</SectionLabel>
        {results.sections.map((section) => {
          const isCurrent = section.id === currentSection?.id;
          return (
            <Link
              key={section.id}
              href={routes.examReview(attemptId, section.answers[0]?.id ?? currentQuestionId)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "press flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 ease-out",
                isCurrent ? "bg-accent-soft" : "hover:bg-sunken",
              )}
            >
              <span className={cn("flex-1 truncate text-[13px]", isCurrent ? "font-medium text-accent-strong" : "text-ink-soft")}>
                {section.subject.shortName[UI_LANGUAGE]}
              </span>
              <span className={cn("text-xs", isCurrent ? "text-accent-strong" : "text-ink-faint")}>
                {section.correctCount}/{section.questionCount}
              </span>
            </Link>
          );
        })}
      </div>

      {currentSection ? (
        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <SectionLabel>
            {currentSection.subject.shortName[UI_LANGUAGE]} · {currentSection.correctCount} из{" "}
            {currentSection.questionCount} верно
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

          <ul className="flex flex-col gap-2.5 border-t border-line pt-4 text-[13px] text-ink-muted">
            {LEGEND.map((item) => (
              <li key={item.status} className="flex items-center gap-2.5">
                <span className={cn("size-3.5 rounded-[4px]", item.swatch)} aria-hidden />
                <span className="flex-1">{item.label}</span>
                <span className="text-ink-soft">
                  {currentSection.answers.filter((answer) => answer.status === item.status).length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        href={routes.examResults(attemptId)}
        className="mt-auto flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:text-accent"
      >
        К таблице результатов
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </Surface>
  );
}
