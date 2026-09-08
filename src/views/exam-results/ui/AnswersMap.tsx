import { type AnswerStatus, AnswerStatusCell, type SectionResult } from "@/entities/attempt";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { Surface } from "@/shared/ui";

type AnswersMapProps = {
  attemptId: number;
  sections: SectionResult[];
};

const LEGEND: Array<{ status: AnswerStatus; label: string; swatch: string }> = [
  { status: "correct", label: "Верно", swatch: "bg-correct-soft ring-1 ring-correct/20" },
  { status: "wrong", label: "Неверно", swatch: "bg-wrong-soft ring-1 ring-wrong/20" },
  { status: "empty", label: "Без ответа", swatch: "bg-surface ring-1 ring-line" },
];

export function AnswersMap({ attemptId, sections }: AnswersMapProps) {
  const all = sections.flatMap((section) => section.answers);

  return (
    <Surface className="flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-[19px] font-medium tracking-[-0.4px] text-ink">Карта ответов</h2>
        <p className="text-[13px] text-ink-muted">Нажмите на номер, чтобы открыть вопрос и разбор</p>
      </div>

      <div className="flex flex-col border-t border-line">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col gap-2.5 border-b border-line py-4 last:border-b-0 sm:flex-row sm:items-start sm:gap-6"
          >
            <div className="flex w-full items-baseline justify-between gap-3 sm:w-[196px] sm:shrink-0 sm:flex-col sm:items-start sm:gap-1">
              <span className="text-[13px] font-medium text-ink">{section.subject.name[UI_LANGUAGE]}</span>
              <span className="text-[11px] text-ink-faint">
                {section.correctCount} из {section.questionCount} верно
              </span>
            </div>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {section.answers.map((answer) => (
                <AnswerStatusCell key={answer.id} answer={answer} href={routes.examReview(attemptId, answer.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-ink-muted">
        {LEGEND.map((item) => (
          <li key={item.status} className="flex items-center gap-2">
            <span className={cn("size-3 rounded-[4px]", item.swatch)} aria-hidden />
            <span>
              {item.label}{" "}
              <span className="text-ink-faint">— {all.filter((answer) => answer.status === item.status).length}</span>
            </span>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
