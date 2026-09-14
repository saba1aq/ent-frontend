import { ArrowLeft, ArrowRight, Flag } from "lucide-react";

import type { QuestionDetail } from "@/entities/attempt";
import { cn } from "@/shared/lib/cn";
import { Button, SectionLabel, SelectBubble, Spinner, Surface } from "@/shared/ui";

import { QUESTION_FLAG_CLASSES } from "./QuestionCell";

type QuestionPanelProps = {
  detail: QuestionDetail | undefined;
  sectionName: string | undefined;
  sectionQuestionCount: number | undefined;
  hasPrevious: boolean;
  hasNext: boolean;
  isFinishing: boolean;
  onSelect: (optionId: number) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

function questionLabel(detail: QuestionDetail | undefined, total: number | undefined): string {
  if (!detail) {
    return "Вопрос";
  }
  if (total === undefined) {
    return `Вопрос ${detail.number}`;
  }
  return `Вопрос ${detail.number} из ${total}`;
}

export function QuestionPanel({
  detail,
  sectionName,
  sectionQuestionCount,
  hasPrevious,
  hasNext,
  isFinishing,
  onSelect,
  onFlag,
  onPrevious,
  onNext,
  onFinish,
}: QuestionPanelProps) {
  const label = questionLabel(detail, sectionQuestionCount);
  const isFlagged = detail?.isFlagged ?? false;

  return (
    <Surface as="section" className="flex min-w-0 flex-col justify-between">
      <div className="flex min-h-[420px] flex-col gap-7 p-5 sm:min-h-[460px] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <SectionLabel>{sectionName ? `${sectionName} · ${label}` : label}</SectionLabel>
          <button
            type="button"
            onClick={onFlag}
            disabled={!detail}
            aria-pressed={isFlagged}
            className={cn(
              "press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[13px] transition-colors duration-150 ease-out",
              detail ? "cursor-pointer" : "cursor-not-allowed opacity-60",
              isFlagged ? QUESTION_FLAG_CLASSES.on : QUESTION_FLAG_CLASSES.off,
            )}
          >
            <Flag className={cn("size-3.5", isFlagged && "stroke-[2.2]")} aria-hidden />
            {isFlagged ? "Отмечен" : "Отметить вопрос"}
          </button>
        </div>

        {detail ? (
          <>
            <p className="text-[19px]/[30px] text-ink-strong sm:text-[21px]/[33px]">{detail.text}</p>
            <div className="flex flex-col gap-2.5">
              <div role={detail.kind === "multiple" ? "group" : "radiogroup"} className="flex flex-col gap-2">
                {detail.options.map((option) => {
                  const isSelected = detail.selectedOptionIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role={detail.kind === "multiple" ? "checkbox" : "radio"}
                      aria-checked={isSelected}
                      onClick={() => onSelect(option.id)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3.5 rounded-md px-4 py-[15px] text-left transition-colors duration-150 ease-out",
                        isSelected
                          ? "bg-accent-soft ring-2 ring-accent"
                          : "bg-surface ring-1 ring-line-strong hover:bg-sunken",
                      )}
                    >
                      <SelectBubble state={isSelected ? "selected" : "idle"} />
                      <span className={cn("text-[15px]/[23px]", isSelected ? "text-ink-strong" : "text-ink")}>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              {detail.kind === "multiple" ? (
                <p className="px-1 text-[13px] text-ink-muted">Несколько верных ответов</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2.5 text-sm text-ink-faint">
            <span className="animate-[fade_140ms_var(--ease-out)_320ms_both] flex items-center gap-2.5">
              <Spinner className="text-ink-faint" />
              Загружаем вопрос…
            </span>
          </div>
        )}
      </div>

      <footer className="border-t border-line">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Button variant="secondary" onClick={onPrevious} disabled={!hasPrevious}>
            <ArrowLeft className="size-4" aria-hidden />
            Предыдущий
          </Button>
          <span className="hidden text-xs text-ink-faint sm:block">Ответы сохраняются автоматически</span>
          {hasNext ? (
            <Button onClick={onNext}>
              Следующий
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={onFinish} disabled={isFinishing}>
              Завершить экзамен
            </Button>
          )}
        </div>
      </footer>
    </Surface>
  );
}
