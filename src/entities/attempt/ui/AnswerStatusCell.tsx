import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import type { AnswerStatus, QuestionResult } from "../model/types";

const STATUS_TINT: Record<AnswerStatus, string> = {
  correct: "bg-correct-soft text-correct",
  wrong: "bg-wrong-soft text-wrong",
  empty: "bg-surface text-ink-faint",
};

const STATUS_RING: Record<AnswerStatus, string> = {
  correct: "ring-1 ring-correct/20 hover:bg-correct/12",
  wrong: "ring-1 ring-wrong/20 hover:bg-wrong/12",
  empty: "ring-1 ring-line hover:bg-sunken",
};

export const ANSWER_STATUS_LABEL: Record<AnswerStatus, string> = {
  correct: "верно",
  wrong: "неверно",
  empty: "без ответа",
};

type AnswerStatusCellProps = {
  answer: QuestionResult;
  href: string;
  isCurrent?: boolean;
  size?: "sm" | "md";
};

export function AnswerStatusCell({ answer, href, isCurrent = false, size = "sm" }: AnswerStatusCellProps) {
  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`Вопрос ${answer.number}: ${ANSWER_STATUS_LABEL[answer.status]}`}
      className={cn(
        "press-tight flex items-center justify-center rounded-md text-[11px] font-medium transition-colors duration-150 ease-out",
        size === "sm" ? "size-7" : "h-8 min-w-8",
        STATUS_TINT[answer.status],
        isCurrent ? "ring-2 ring-accent" : STATUS_RING[answer.status],
      )}
    >
      {answer.number}
    </Link>
  );
}
