"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { type AttemptResults, fetchResults } from "@/entities/attempt";
import { ApiError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";

import { AnswersMap } from "./AnswersMap";
import { ResultsTable } from "./ResultsTable";

type ExamResultsPageProps = {
  attemptId: string;
};

export function ExamResultsPage({ attemptId }: ExamResultsPageProps) {
  const router = useRouter();
  const [results, setResults] = useState<AttemptResults | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError(caught instanceof ApiError ? caught.message : "Не удалось загрузить результаты.");
      });
    return () => {
      cancelled = true;
    };
  }, [attemptId, router]);

  if (!results) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <p className="w-full text-center text-sm text-ink-faint">{error ?? "Считаем результат…"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-[1.4px] text-ink-faint uppercase">
            {results.status === "expired" ? "Время вышло · результаты" : "Результаты"}
          </p>
          <h1 className="font-serif text-[32px] font-medium tracking-[-0.8px] text-ink lg:text-4xl">
            {results.totalScore} <span className="text-ink-faint">/ {results.maxScore}</span>{" "}
            <span className="text-2xl text-ink-muted">баллов</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href={routes.exams} className="text-[13px] font-medium text-ink-soft hover:underline">
            Все пробники
          </Link>
          <Link href={routes.examSetup} className="text-[13px] font-medium text-ink-soft hover:underline">
            Собрать новый вариант →
          </Link>
        </div>
      </header>

      <ResultsTable attemptId={results.id} sections={results.sections} />
      <AnswersMap attemptId={results.id} sections={results.sections} />
    </main>
  );
}
