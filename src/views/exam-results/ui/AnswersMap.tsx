import { X } from "lucide-react";

import { type AnswerStatus, AnswerStatusCell, type SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { Surface } from "@/shared/ui";

type AnswersMapProps = {
  attemptId: number;
  sections: SectionResult[];
};

export function AnswersMap({ attemptId, sections }: AnswersMapProps) {
  const all = sections.flatMap((section) => section.answers);
  const count = (status: AnswerStatus) => all.filter((answer) => answer.status === status).length;

  return (
    <Surface className="flex flex-col gap-3.5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-base font-medium text-ink">Карта ответов</h2>
          <p className="text-xs text-ink-faint">Нажмите на номер, чтобы открыть вопрос и разбор</p>
        </div>
        <ul className="flex flex-wrap items-center gap-[18px] text-xs text-ink-muted">
          <li className="flex items-center gap-[7px]">
            <span className="size-4 rounded-[3px] bg-surface outline outline-line-strong" aria-hidden />
            Верно — {count("correct")}
          </li>
          <li className="flex items-center gap-[7px]">
            <span className="flex size-4 items-center justify-center rounded-[3px] bg-ink" aria-hidden>
              <X className="size-2.5 text-surface" />
            </span>
            Неверно — {count("wrong")}
          </li>
          <li className="flex items-center gap-[7px]">
            <span className="size-4 rounded-[3px] bg-canvas outline outline-line-strong" aria-hidden />
            Без ответа — {count("empty")}
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-line pt-3.5">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex w-full flex-col gap-0.5 sm:w-[190px] sm:shrink-0">
              <span className="text-[13px] font-medium text-ink">{section.subject.name[UI_LANGUAGE]}</span>
              <span className="font-mono text-[11px] text-ink-faint">
                {section.correctCount} из {section.questionCount} верно
              </span>
            </div>
            <div className="flex flex-1 flex-wrap gap-1">
              {section.answers.map((answer) => (
                <AnswerStatusCell key={answer.id} answer={answer} href={routes.examReview(attemptId, answer.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
