import { Circle, CircleCheck, CircleDot } from "lucide-react";

import type { AttemptOverview, SectionOverview } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { formatClock, pluralize } from "@/shared/lib/format";
import { Button, SectionLabel, Surface } from "@/shared/ui";

import type { FlatQuestion } from "../model/use-exam-run";
import { QuestionCell } from "./QuestionCell";

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
    <Surface as="aside" className="flex w-full flex-col gap-[22px] p-[22px] lg:w-[320px] lg:shrink-0">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>Осталось времени</SectionLabel>
        <span className={cn("font-mono text-lg tabular-nums", isUrgent ? "text-ink" : "text-ink-soft")}>
          {remainingSeconds === null ? "—" : formatClock(remainingSeconds)}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <SectionLabel className="mb-2">Блоки теста</SectionLabel>
        {overview.sections.map((section) => {
          const isCurrent = section.id === currentSection?.id;
          const isDone = section.answeredCount === section.questionCount;
          const Icon = isDone ? CircleCheck : isCurrent ? CircleDot : Circle;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onGoTo(section.questions[0].id)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-left transition-colors",
                isCurrent ? "bg-sunken outline outline-ink-soft" : "hover:bg-canvas",
              )}
            >
              <Icon className={cn("size-[15px] shrink-0", isDone || isCurrent ? "text-ink-soft" : "text-ink-faint")} aria-hidden />
              <span className={cn("flex-1 truncate text-[13px]", isCurrent ? "font-medium text-ink" : isDone ? "text-ink" : "text-ink-faint")}>
                {section.subject.shortName[UI_LANGUAGE]}
              </span>
              <span className={cn("font-mono text-[11px]", isCurrent ? "text-ink-soft" : "text-ink-faint")}>
                {section.answeredCount}/{section.questionCount}
              </span>
            </button>
          );
        })}
      </div>

      {currentSection ? (
        <div className="flex flex-col gap-2.5 border-t border-line pt-[18px]">
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

      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-xs text-ink-muted">
        <LegendRow swatch="bg-sunken outline-line" text={`Отвечено — ${answered}`} />
        <LegendRow swatch="bg-sunken outline-ink-soft" text={`Отмечено — ${flagged}`} />
        <LegendRow swatch="bg-surface outline-line" text={`Без ответа — ${unanswered}`} />
      </ul>

      <div className="flex flex-col gap-2">
        <Button variant="secondary" onClick={onOpenOverview} className="w-full py-3">
          Обзор всех ответов
        </Button>
        <Button variant="ghost" onClick={onRequestFinish} className="w-full py-3 text-ink-muted hover:text-ink">
          Завершить экзамен
        </Button>
      </div>
    </Surface>
  );
}

function LegendRow({ swatch, text }: { swatch: string; text: string }) {
  return (
    <li className="flex items-center gap-[9px]">
      <span className={cn("size-3.5 rounded-[3px] outline", swatch)} aria-hidden />
      {text}
    </li>
  );
}
