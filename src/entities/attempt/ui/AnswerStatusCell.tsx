import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import type { AnswerStatus, QuestionResult } from "../model/types";

const STATUS_CLASSES: Record<AnswerStatus, string> = {
  correct: "bg-surface text-ink outline outline-line-strong hover:bg-canvas",
  wrong: "bg-ink text-surface hover:bg-ink-strong",
  empty: "bg-canvas text-ink-faint outline outline-line-strong hover:bg-sunken",
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
        "flex items-center justify-center rounded-md font-mono text-[11px] transition-colors",
        size === "sm" ? "size-7" : "h-8 min-w-8",
        STATUS_CLASSES[answer.status],
        isCurrent && "outline-2 outline-ink-soft outline-offset-1",
      )}
    >
      {answer.number}
    </Link>
  );
}
