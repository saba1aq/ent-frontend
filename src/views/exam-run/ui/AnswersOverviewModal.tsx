"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { AttemptOverview } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { Button, SectionLabel } from "@/shared/ui";

import type { FlatQuestion } from "../model/use-exam-run";
import { QuestionCell } from "./QuestionCell";

type AnswersOverviewModalProps = {
  overview: AttemptOverview;
  flat: FlatQuestion[];
  currentId: number | null;
  isFinishing: boolean;
  withFinishActions: boolean;
  onClose: () => void;
  onGoTo: (questionId: number) => void;
  onFinish: () => void;
};

export function AnswersOverviewModal({
  overview,
  flat,
  currentId,
  isFinishing,
  withFinishActions,
  onClose,
  onGoTo,
  onFinish,
}: AnswersOverviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const answered = flat.filter((question) => question.isAnswered).length;
  const flagged = flat.filter((question) => question.isFlagged).length;
  const unanswered = flat.length - answered;

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="answers-overview-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-[880px] flex-col rounded-t-md bg-surface outline outline-line sm:max-h-[85vh] sm:rounded-md"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-1.5">
            <h2 id="answers-overview-title" className="text-base font-medium text-ink">
              Обзор всех ответов
            </h2>
            <p className="font-mono text-[11px] text-ink-faint">
              Отвечено {answered} из {flat.length} · Отмечено {flagged} · Без ответа {unanswered}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть обзор"
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          {overview.sections.map((section) => (
            <section key={section.id} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <SectionLabel as="h3">{section.subject.name[UI_LANGUAGE]}</SectionLabel>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    section.answeredCount === section.questionCount ? "text-ink-soft" : "text-ink-faint",
                  )}
                >
                  {section.answeredCount}/{section.questionCount}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {section.questions.map((question) => (
                  <QuestionCell
                    key={question.id}
                    question={question}
                    isCurrent={question.id === currentId}
                    onClick={() => onGoTo(question.id)}
                  />
                ))}
              </div>
            </section>
          ))}

          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-ink-muted">
            <LegendItem swatch="bg-sunken outline-line" text="Отвечено" />
            <LegendItem swatch="bg-sunken outline-ink-soft" text="Отмечено" />
            <LegendItem swatch="bg-surface outline-line" text="Без ответа" />
            <LegendItem swatch="bg-ink-soft outline-ink-soft" text="Текущий" />
          </ul>
        </div>

        {withFinishActions ? (
          <footer className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button variant="secondary" onClick={onClose} className="py-3">
              Вернуться к вопросам
            </Button>
            <Button onClick={onFinish} disabled={isFinishing} className="py-3">
              Завершить экзамен
            </Button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

function LegendItem({ swatch, text }: { swatch: string; text: string }) {
  return (
    <li className="flex items-center gap-[7px]">
      <span className={cn("size-3.5 rounded-[3px] outline", swatch)} aria-hidden />
      {text}
    </li>
  );
}
