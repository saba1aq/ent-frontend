"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type AttemptResults, fetchResults } from "@/entities/attempt";
import { fetchStreak, type Streak, StreakCard } from "@/entities/streak";
import { ApiError, describeError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { formatHoursMinutes } from "@/shared/lib/format";
import { showToast } from "@/shared/lib/toast-store";
import { SectionLabel, Spinner } from "@/shared/ui";

import { AnswersMap } from "./AnswersMap";
import { ResultsTable } from "./ResultsTable";

type ExamResultsPageProps = {
  attemptId: string;
};

export function ExamResultsPage({ attemptId }: ExamResultsPageProps) {
  const router = useRouter();
  const [results, setResults] = useState<AttemptResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchResults(attemptId)
      .then((loaded) => {
        if (!cancelled) {
          setResults(loaded);
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
        const message = describeError(caught, "Не удалось загрузить результаты.");
        showToast(message);
        setError(message);
      });
    fetchStreak()
      .then((loaded) => {
        if (!cancelled) {
          setStreak(loaded);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [attemptId, router]);

  if (!results) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
        {error ? (
          <p role="alert" className="text-center text-sm text-wrong">
            {error}
          </p>
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-ink-muted">
            <Spinner className="text-ink-faint" />
            Считаем результат…
          </p>
        )}
      </main>
    );
  }

  const correctCount = results.sections.reduce((total, section) => total + section.correctCount, 0);
  const questionCount = results.sections.reduce((total, section) => total + section.questionCount, 0);
  const timeSpentSeconds = results.sections.reduce((total, section) => total + section.timeSpentSeconds, 0);
  const accuracyPercent = questionCount === 0 ? 0 : Math.round((correctCount / questionCount) * 100);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 lg:px-10">
      <header className="animate-enter flex flex-col gap-7">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex flex-col gap-2.5">
            <SectionLabel>{results.status === "expired" ? "Время вышло · результаты" : "Результаты"}</SectionLabel>
            <h1 className="font-display text-[44px]/[1] font-medium tracking-[-1.2px] text-ink-strong sm:text-[56px]/[1]">
              {results.totalScore}
              <span className="text-[22px] tracking-[-0.4px] text-ink-faint sm:text-[26px]">
                {" "}
                / {results.maxScore} баллов
              </span>
            </h1>
          </div>

          <dl className="flex flex-wrap items-start gap-x-9 gap-y-4">
            <Metric label="Точность" value={`${accuracyPercent}%`} />
            <Metric label="Верных ответов" value={`${correctCount} из ${questionCount}`} />
            <Metric label="Время" value={formatHoursMinutes(timeSpentSeconds)} />
          </dl>
        </div>
      </header>

      {streak ? <StreakCard streak={streak} /> : null}

      <div className="stagger flex flex-col gap-4">
        <ResultsTable attemptId={results.id} sections={results.sections} />
        <AnswersMap attemptId={results.id} sections={results.sections} />
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <SectionLabel as="dt">{label}</SectionLabel>
      <dd className="font-display text-[19px] font-medium tracking-[-0.3px] text-ink">{value}</dd>
    </div>
  );
}
