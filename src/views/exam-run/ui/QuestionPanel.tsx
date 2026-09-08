import { Flag } from "lucide-react";

import type { QuestionDetail } from "@/entities/attempt";
import { cn } from "@/shared/lib/cn";
import { Button, Surface } from "@/shared/ui";

const LETTERS = "ABCDEFGH";

type QuestionPanelProps = {
  detail: QuestionDetail | undefined;
  hasPrevious: boolean;
  hasNext: boolean;
  isFinishing: boolean;
  onSelect: (optionId: number) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function QuestionPanel({
  detail,
  hasPrevious,
  hasNext,
  isFinishing,
  onSelect,
  onFlag,
  onPrevious,
  onNext,
  onFinish,
}: QuestionPanelProps) {
  return (
    <Surface as="section" className="flex min-w-0 flex-1 flex-col justify-between">
      <div className="flex flex-col gap-6 p-5 sm:p-9">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onFlag}
            disabled={!detail}
            aria-pressed={detail?.isFlagged ?? false}
            className={cn(
              "flex cursor-pointer items-center gap-[7px] rounded-full px-[13px] py-[7px] text-xs transition-colors",
              detail?.isFlagged
                ? "bg-sunken text-ink outline outline-ink-soft"
                : "text-ink-muted outline outline-line-strong hover:bg-canvas",
            )}
          >
            <Flag className="size-3.5" aria-hidden />
            {detail?.isFlagged ? "Отмечен" : "Отметить вопрос"}
          </button>
          {detail ? (
            <span className="font-mono text-[11px] text-ink-faint">
              {detail.kind === "multiple" ? "Несколько верных ответов" : "Один верный ответ"}
            </span>
          ) : null}
        </div>

        {detail ? (
          <>
            <p className="text-[17px]/[27px] text-ink sm:text-[19px]/[29px]">{detail.text}</p>
            <div role={detail.kind === "multiple" ? "group" : "radiogroup"} className="flex flex-col gap-2.5">
              {detail.options.map((option, index) => {
                const isSelected = detail.selectedOptionIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    role={detail.kind === "multiple" ? "checkbox" : "radio"}
                    aria-checked={isSelected}
                    onClick={() => onSelect(option.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3.5 rounded-md px-[18px] py-4 text-left transition-colors",
                      isSelected ? "bg-sunken outline-2 outline-ink-soft" : "bg-surface outline outline-line-strong hover:bg-canvas",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium",
                        isSelected ? "bg-ink-soft text-surface" : "bg-canvas text-ink-muted",
                      )}
                    >
                      {LETTERS[index] ?? index + 1}
                    </span>
                    <span className="text-[15px] text-ink">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-faint">Загружаем вопрос…</p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-9">
        <Button variant="secondary" onClick={onPrevious} disabled={!hasPrevious} className="py-3">
          ← Предыдущий
        </Button>
        <span className="hidden text-xs text-ink-faint sm:block">Ответы сохраняются автоматически</span>
        {hasNext ? (
          <Button onClick={onNext} className="py-3">
            Следующий →
          </Button>
        ) : (
          <Button onClick={onFinish} disabled={isFinishing} className="py-3">
            Завершить экзамен
          </Button>
        )}
      </footer>
    </Surface>
  );
}
