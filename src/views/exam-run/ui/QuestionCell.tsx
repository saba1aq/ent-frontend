import type { QuestionNav } from "@/entities/attempt";
import { cn } from "@/shared/lib/cn";

type QuestionCellProps = {
  question: QuestionNav;
  isCurrent: boolean;
  onClick: () => void;
};

export function questionCellClasses(question: QuestionNav, isCurrent: boolean): string {
  if (isCurrent) {
    return "bg-ink-soft text-surface";
  }
  if (question.isFlagged) {
    return "bg-sunken text-ink-soft outline outline-ink-soft";
  }
  if (question.isAnswered) {
    return "bg-sunken text-ink-soft outline outline-line";
  }
  return "bg-surface text-ink-faint outline outline-line hover:bg-canvas";
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
        "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md font-mono text-[11px] transition-colors",
        questionCellClasses(question, isCurrent),
      )}
    >
      {question.number}
    </button>
  );
}
