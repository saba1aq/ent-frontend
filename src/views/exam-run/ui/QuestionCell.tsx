import type { QuestionNav } from "@/entities/attempt";
import { cn } from "@/shared/lib/cn";

export const QUESTION_STATE_CLASSES = {
  current: "bg-accent text-white font-medium ring-1 ring-accent",
  flagged: "bg-surface text-ink-strong font-semibold ring-[1.5px] ring-ink hover:bg-canvas",
  answered: "bg-answered text-ink-strong font-medium ring-1 ring-line-strong hover:bg-line-strong",
  unanswered: "bg-surface text-ink-muted font-medium ring-1 ring-line-strong hover:bg-sunken",
} as const;

export const QUESTION_FLAG_CLASSES = {
  on: "bg-surface text-ink-strong font-semibold ring-[1.5px] ring-ink hover:bg-canvas",
  off: "bg-surface text-ink-soft font-medium ring-1 ring-line-strong hover:bg-canvas",
} as const;

export const QUESTION_LEGEND = [
  { key: "answered", label: "Отвечено", swatch: "bg-answered ring-1 ring-line-strong" },
  { key: "flagged", label: "Отмечено", swatch: "bg-surface ring-[1.5px] ring-ink" },
  { key: "unanswered", label: "Без ответа", swatch: "bg-surface ring-1 ring-line-strong" },
  { key: "current", label: "Текущий", swatch: "bg-accent ring-1 ring-accent" },
] as const;

type QuestionCellProps = {
  question: QuestionNav;
  isCurrent: boolean;
  onClick: () => void;
};

function stateClasses(question: QuestionNav, isCurrent: boolean): string {
  if (isCurrent) {
    return QUESTION_STATE_CLASSES.current;
  }
  if (question.isFlagged) {
    return QUESTION_STATE_CLASSES.flagged;
  }
  if (question.isAnswered) {
    return QUESTION_STATE_CLASSES.answered;
  }
  return QUESTION_STATE_CLASSES.unanswered;
}

export function QuestionCell({ question, isCurrent, onClick }: QuestionCellProps) {
  const status = question.isAnswered ? "отвечено" : "без ответа";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isCurrent ? "true" : undefined}
      aria-label={`Вопрос ${question.number}: ${status}${question.isFlagged ? ", отмечен" : ""}`}
      className={cn(
        "press-tight flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md text-[11px] transition-colors duration-150 ease-out",
        stateClasses(question, isCurrent),
      )}
    >
      {question.number}
    </button>
  );
}
