"use client";

import type { AttemptOverview } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { Button, Modal, SectionLabel } from "@/shared/ui";

import type { FlatQuestion } from "../model/use-exam-run";
import { QUESTION_LEGEND, QuestionCell } from "./QuestionCell";

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
  const answered = flat.filter((question) => question.isAnswered).length;
  const flagged = flat.filter((question) => question.isFlagged).length;
  const unanswered = flat.length - answered;

  return (
    <Modal
      className="sm:max-w-[900px]"
      title="Обзор всех ответов"
      subtitle={`Отвечено ${answered} из ${flat.length} · Отмечено ${flagged} · Без ответа ${unanswered}`}
      onClose={onClose}
      footer={
        withFinishActions ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Вернуться к вопросам
            </Button>
            <Button onClick={onFinish} loading={isFinishing}>
              Завершить экзамен
            </Button>
          </>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        {overview.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <SectionLabel as="h3">{section.subject.name[UI_LANGUAGE]}</SectionLabel>
              <span
                className={cn(
                  "text-xs",
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
                  onClick={() => {
                    onGoTo(question.id);
                    onClose();
                  }}
                />
              ))}
            </div>
          </section>
        ))}

        <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-[13px] text-ink-muted">
          {QUESTION_LEGEND.map((item) => (
            <LegendItem key={item.key} swatch={item.swatch} label={item.label} />
          ))}
        </ul>
      </div>
    </Modal>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={cn("size-3.5 rounded-[4px]", swatch)} aria-hidden />
      {label}
    </li>
  );
}
