import type { AttemptOverview, SectionOverview } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { formatClock, pluralize } from "@/shared/lib/format";
import { Button, SectionLabel, Surface } from "@/shared/ui";

import type { FlatQuestion } from "../model/use-exam-run";
import { QUESTION_LEGEND, QuestionCell } from "./QuestionCell";

type NavPanelProps = {
  overview: AttemptOverview;
  flat: FlatQuestion[];
  currentSection: SectionOverview | undefined;
  currentId: number | null;
  remainingSeconds: number | null;
  onGoTo: (questionId: number) => void;
  onOpenOverview: () => void;
  onRequestFinish: () => void;
};

export function NavPanel({
  overview,
  flat,
  currentSection,
  currentId,
  remainingSeconds,
  onGoTo,
  onOpenOverview,
  onRequestFinish,
}: NavPanelProps) {
  const answered = flat.filter((question) => question.isAnswered).length;
  const flagged = flat.filter((question) => question.isFlagged).length;
  const unanswered = flat.length - answered;
  const isUrgent = remainingSeconds !== null && remainingSeconds <= 5 * 60;

  return (
    <Surface as="aside" className="flex w-full flex-col gap-6 p-5 lg:w-[320px] lg:shrink-0">
      <div className="flex flex-col gap-2">
        <SectionLabel>Осталось времени</SectionLabel>
        <span
          className={cn(
            "font-display text-[34px] leading-none font-medium tracking-[-1px]",
            isUrgent ? "text-wrong" : "text-ink-strong",
          )}
        >
          {remainingSeconds === null ? "—" : formatClock(remainingSeconds)}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <SectionLabel className="mb-2">Блоки теста</SectionLabel>
        {overview.sections.map((section) => {
          const isCurrent = section.id === currentSection?.id;
          const isDone = section.answeredCount === section.questionCount;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onGoTo(section.questions[0].id)}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "press flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150 ease-out",
                isCurrent ? "bg-accent-soft" : "hover:bg-sunken",
              )}
            >
              <span className={cn("flex-1 truncate text-[13px]", isCurrent ? "font-medium text-accent" : "text-ink-soft")}>
                {section.subject.shortName[UI_LANGUAGE]}
              </span>
              <span className={cn("text-xs", isCurrent ? "text-accent" : isDone ? "text-ink-soft" : "text-ink-faint")}>
                {section.answeredCount}/{section.questionCount}
              </span>
            </button>
          );
        })}
      </div>

      {currentSection ? (
        <div className="flex flex-col gap-3 border-t border-line pt-5">
          <SectionLabel>
            {currentSection.subject.shortName[UI_LANGUAGE]} · {currentSection.questionCount}{" "}
            {pluralize(currentSection.questionCount, ["вопрос", "вопроса", "вопросов"])}
          </SectionLabel>
          <div className="grid grid-cols-7 gap-1.5">
            {currentSection.questions.map((question) => (
              <QuestionCell
                key={question.id}
                question={question}
                isCurrent={question.id === currentId}
                onClick={() => onGoTo(question.id)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <ul className="flex flex-col gap-2.5 border-t border-line pt-4 text-[13px] text-ink-muted">
        <LegendRow swatch={QUESTION_LEGEND[0].swatch} label={QUESTION_LEGEND[0].label} count={answered} />
        <LegendRow swatch={QUESTION_LEGEND[1].swatch} label={QUESTION_LEGEND[1].label} count={flagged} />
        <LegendRow swatch={QUESTION_LEGEND[2].swatch} label={QUESTION_LEGEND[2].label} count={unanswered} />
      </ul>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="secondary" onClick={onOpenOverview} className="w-full">
          Обзор всех ответов
        </Button>
        <Button variant="ghost" onClick={onRequestFinish} className="w-full">
          Завершить экзамен
        </Button>
      </div>
    </Surface>
  );
}

function LegendRow({ swatch, label, count }: { swatch: string; label: string; count: number }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className={cn("size-3.5 rounded-[4px]", swatch)} aria-hidden />
      <span className="flex-1">{label}</span>
      <span className="text-ink-soft">{count}</span>
    </li>
  );
}
