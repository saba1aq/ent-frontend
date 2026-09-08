"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type AttemptResults,
  fetchResults,
  fetchReview,
  type QuestionReview,
} from "@/entities/attempt";
import { ApiError, NotAuthenticatedError } from "@/shared/api";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { SectionLabel, Surface } from "@/shared/ui";

import { buildReviewNavigation } from "../model/review-navigation";
import { ReviewNavPanel } from "./ReviewNavPanel";

const LETTERS = "ABCDEFGH";

type ExamReviewPageProps = {
  attemptId: string;
  questionId: string;
};

export function ExamReviewPage({ attemptId, questionId }: ExamReviewPageProps) {
  const router = useRouter();
  const [review, setReview] = useState<QuestionReview | null>(null);
  const [results, setResults] = useState<AttemptResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchReview(attemptId, questionId), fetchResults(attemptId)])
      .then(([loadedReview, loadedResults]) => {
        if (!cancelled) {
          setReview(loadedReview);
          setResults(loadedResults);
        }
      })
      .catch((caught: unknown) => {
        if (caught instanceof NotAuthenticatedError) {
          return;
        }
        if (
          caught instanceof ApiError &&
          caught.code === "attempt_not_finished"
        ) {
          router.replace(routes.exam(attemptId));
          return;
        }
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Не удалось загрузить разбор.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [attemptId, questionId, router]);

  if (!review || !results) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <p className="w-full text-center text-sm text-ink-faint">
          {error ?? "Открываем разбор…"}
        </p>
      </main>
    );
  }

  const navigation = buildReviewNavigation(results, review.id);
  const verdict =
    review.isCorrect === null
      ? "Без ответа"
      : review.isCorrect
        ? "Верно"
        : review.score > 0
          ? "Частично верно"
          : "Неверно";

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-5 py-6 lg:px-10">
      <Link
        href={routes.examResults(attemptId)}
        className="flex w-fit items-center gap-[7px] text-[13px] font-medium text-ink-muted hover:text-ink-soft"
      >
        <ArrowLeft className="size-[15px]" aria-hidden />К результатам
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Surface as="article" className="flex flex-col gap-6 p-5 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionLabel>
                {navigation.section?.subject.name[UI_LANGUAGE] ?? "Вопрос"} ·
                Вопрос {review.number}
              </SectionLabel>
              <span className="font-mono text-xs text-ink-muted">
                {verdict} · {review.score} / {review.maxScore}
              </span>
            </div>

            <p className="text-[17px]/[27px] text-ink sm:text-[19px]/[29px]">
              {review.text}
            </p>

            <ul className="flex flex-col gap-2.5">
              {review.options.map((option, index) => (
                <li
                  key={option.id}
                  className={cn(
                    "flex items-center gap-3.5 rounded-md px-[18px] py-4",
                    option.isCorrect
                      ? "bg-surface outline-2 outline-ink-soft"
                      : option.isSelected
                        ? "bg-sunken outline outline-line-strong"
                        : "bg-surface outline outline-line",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium",
                      option.isCorrect
                        ? "bg-ink-soft text-surface"
                        : "bg-canvas text-ink-muted",
                    )}
                  >
                    {LETTERS[index] ?? index + 1}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[15px]",
                      option.isCorrect || option.isSelected
                        ? "text-ink"
                        : "text-ink-muted",
                    )}
                  >
                    {option.text}
                  </span>
                  {option.isCorrect ? (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-ink-soft">
                      <Check className="size-3.5" aria-hidden />
                      верный
                    </span>
                  ) : option.isSelected ? (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-ink-faint">
                      <X className="size-3.5" aria-hidden />
                      ваш ответ
                    </span>
                  ) : null}
                  {option.isCorrect && option.isSelected ? (
                    <span className="font-mono text-[11px] text-ink-faint">
                      · ваш ответ
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <SectionLabel>Разбор</SectionLabel>
              {review.explanation ? (
                <p className="text-[15px]/[24px] whitespace-pre-line text-ink">
                  {review.explanation}
                </p>
              ) : (
                <p className="text-sm text-ink-faint">
                  Разбор к этому вопросу ещё не добавлен.
                </p>
              )}
            </div>
          </Surface>

          <nav className="flex flex-wrap items-center justify-between gap-3">
            <NavLink
              attemptId={attemptId}
              targetId={navigation.previousId}
              label="← Предыдущий"
            />
            <div className="flex gap-3">
              <NavLink
                attemptId={attemptId}
                targetId={navigation.nextWrongId}
                label="Следующая ошибка →"
                primary
              />
              <NavLink
                attemptId={attemptId}
                targetId={navigation.nextId}
                label="Следующий →"
              />
            </div>
          </nav>
        </div>

        <ReviewNavPanel
          attemptId={attemptId}
          results={results}
          currentSection={navigation.section}
          currentQuestionId={review.id}
        />
      </div>
    </main>
  );
}

function NavLink({
  attemptId,
  targetId,
  label,
  primary = false,
}: {
  attemptId: string;
  targetId: number | null;
  label: string;
  primary?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors",
    primary
      ? "bg-ink-soft text-surface hover:bg-ink"
      : "bg-surface text-ink outline outline-line-strong hover:bg-canvas",
  );
  if (targetId === null) {
    return (
      <span className={cn(classes, "cursor-not-allowed opacity-40")}>
        {label}
      </span>
    );
  }
  return (
    <Link href={routes.examReview(attemptId, targetId)} className={classes}>
      {label}
    </Link>
  );
}
