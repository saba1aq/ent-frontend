"use client";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type AttemptResults, type QuestionReview, type ReviewOption } from "@/entities/attempt";
import { ApiError, describeError, NotAuthenticatedError } from "@/shared/api";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { showToast } from "@/shared/lib/toast-store";
import { cn } from "@/shared/lib/cn";
import { Button, PageContainer, PageState, SectionLabel, Spinner, Surface } from "@/shared/ui";

import { loadResults, loadReview, peekResults, peekReview, prefetchReview } from "../model/review-cache";
import { buildReviewNavigation } from "../model/review-navigation";
import { ReviewNavPanel } from "./ReviewNavPanel";

const LETTERS = "ABCDEFGH";

type OptionTone = "correct" | "wrong" | "neutral";

const OPTION_ROW: Record<OptionTone, string> = {
  correct: "bg-correct-soft ring-1 ring-correct/20",
  wrong: "bg-wrong-soft ring-1 ring-wrong/20",
  neutral: "bg-surface ring-1 ring-line",
};

const OPTION_BUBBLE: Record<OptionTone, string> = {
  correct: "bg-correct text-white",
  wrong: "bg-wrong text-white",
  neutral: "bg-sunken text-ink-muted",
};

const OPTION_TEXT: Record<OptionTone, string> = {
  correct: "text-ink",
  wrong: "text-ink",
  neutral: "text-ink-muted",
};

function optionTone(option: ReviewOption): OptionTone {
  if (option.isCorrect) {
    return "correct";
  }
  return option.isSelected ? "wrong" : "neutral";
}

function verdictOf(review: QuestionReview): {
  label: string;
  className: string;
} {
  if (review.isCorrect === null) {
    return { label: "Без ответа", className: "bg-sunken text-ink-muted" };
  }
  if (review.isCorrect) {
    return { label: "Верно", className: "bg-correct-soft text-correct" };
  }
  if (review.score > 0) {
    return { label: "Частично верно", className: "bg-flag-soft text-flag" };
  }
  return { label: "Неверно", className: "bg-wrong-soft text-wrong" };
}

type ExamReviewPageProps = {
  attemptId: string;
  questionId: string;
};

export function ExamReviewPage({ attemptId, questionId }: ExamReviewPageProps) {
  const router = useRouter();
  const [review, setReview] = useState<QuestionReview | null>(() => peekReview(attemptId, questionId));
  const [results, setResults] = useState<AttemptResults | null>(() => peekResults(attemptId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadReview(attemptId, questionId), loadResults(attemptId)])
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
        if (caught instanceof ApiError && caught.code === "attempt_not_finished") {
          router.replace(routes.exam(attemptId));
          return;
        }
        const message = describeError(caught, "Не удалось загрузить разбор.");
        showToast(message);
        setError(message);
      });
    return () => {
      cancelled = true;
    };
  }, [attemptId, questionId, router]);

  useEffect(() => {
    if (!results || !review) {
      return;
    }
    const around = buildReviewNavigation(results, review.id);
    prefetchReview(attemptId, around.previousId);
    prefetchReview(attemptId, around.nextId);
    results.sections.forEach((section) => prefetchReview(attemptId, section.answers[0]?.id));
  }, [attemptId, results, review]);

  if (!results) {
    return <PageState tone={error ? "error" : "loading"} message={error ?? "Открываем разбор…"} />;
  }

  const navigation = buildReviewNavigation(results, Number(questionId));

  return (
    <PageContainer width="wide" className="gap-5">
      <Link
        href={routes.examResults(attemptId)}
        className="flex w-fit items-center gap-2 text-[13px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:text-ink"
      >
        <ArrowLeft className="size-[15px]" aria-hidden />К результатам
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Surface as="article" className="flex min-h-[540px] flex-col gap-6 p-5 sm:p-8">
            {review ? (
              <ReviewBody review={review} sectionName={navigation.section?.subject.name[UI_LANGUAGE]} />
            ) : (
              <p className="flex flex-1 animate-[fade_140ms_var(--ease-out)_320ms_both] items-center justify-center gap-2.5 text-sm text-ink-muted">
                <Spinner className="text-ink-faint" />
                Открываем разбор…
              </p>
            )}
          </Surface>

          <nav className="flex flex-wrap items-center justify-between gap-2.5">
            <ReviewNavButton
              attemptId={attemptId}
              targetId={navigation.previousId}
              label="Предыдущий"
              variant="secondary"
              direction="back"
            />
            <ReviewNavButton
              attemptId={attemptId}
              targetId={navigation.nextId}
              label="Следующий"
              variant="secondary"
              direction="forward"
            />
          </nav>
        </div>

        <ReviewNavPanel
          attemptId={attemptId}
          results={results}
          currentSection={navigation.section}
          currentQuestionId={Number(questionId)}
        />
      </div>
    </PageContainer>
  );
}

function ReviewBody({ review, sectionName }: { review: QuestionReview; sectionName?: string }) {
  const verdict = verdictOf(review);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>
          {sectionName ?? "Вопрос"} · Вопрос {review.number}
        </SectionLabel>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
              verdict.className,
            )}
          >
            {verdict.label}
          </span>
          <span className="text-[13px] text-ink-muted">
            {review.score}
            <span className="text-ink-faint"> / {review.maxScore}</span>
          </span>
        </div>
      </div>

      <p className="text-[17px]/[27px] text-ink sm:text-[19px]/[29px]">{review.text}</p>

      <ul className="flex flex-col gap-2">
        {review.options.map((option, index) => {
          const tone = optionTone(option);
          return (
            <li key={option.id} className={cn("flex items-center gap-3.5 rounded-md px-4 py-3.5", OPTION_ROW[tone])}>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  OPTION_BUBBLE[tone],
                )}
              >
                {LETTERS[index] ?? index + 1}
              </span>
              <span className={cn("flex-1 text-[15px]/[22px]", OPTION_TEXT[tone])}>{option.text}</span>
              {tone === "correct" ? (
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-correct">
                  <Check className="size-3.5" aria-hidden />
                  {option.isSelected ? "верный · ваш ответ" : "верный"}
                </span>
              ) : null}
              {tone === "wrong" ? (
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-wrong">
                  <X className="size-3.5" aria-hidden />
                  ваш ответ
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2 rounded-md bg-sunken p-4 sm:p-5">
        <SectionLabel>Разбор</SectionLabel>
        {review.explanation ? (
          <p className="text-[15px]/[24px] whitespace-pre-line text-ink-soft">{review.explanation}</p>
        ) : (
          <p className="text-sm text-ink-faint">Разбор к этому вопросу ещё не добавлен.</p>
        )}
      </div>
    </>
  );
}

function ReviewNavButton({
  attemptId,
  targetId,
  label,
  variant,
  direction,
}: {
  attemptId: string;
  targetId: number | null;
  label: string;
  variant: "primary" | "secondary";
  direction: "back" | "forward";
}) {
  const button = (
    <Button variant={variant} disabled={targetId === null}>
      {direction === "back" ? <ArrowLeft className="size-4" aria-hidden /> : null}
      {label}
      {direction === "forward" ? <ArrowRight className="size-4" aria-hidden /> : null}
    </Button>
  );

  if (targetId === null) {
    return button;
  }

  return <Link href={routes.examReview(attemptId, targetId)}>{button}</Link>;
}
