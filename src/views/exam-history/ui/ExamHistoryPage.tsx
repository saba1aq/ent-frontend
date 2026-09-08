"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type AttemptHistory,
  type AttemptHistoryItem,
  fetchAttemptHistory,
} from "@/entities/attempt";
import { ApiError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { pluralize } from "@/shared/lib/format";
import { Button, Surface } from "@/shared/ui";

import { AttemptsTable } from "./AttemptsTable";
import { HistorySummary } from "./HistorySummary";

function describeError(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

export function ExamHistoryPage() {
  const [history, setHistory] = useState<AttemptHistory | null>(null);
  const [items, setItems] = useState<AttemptHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAttemptHistory()
      .then((loaded) => {
        if (!cancelled) {
          setHistory(loaded);
          setItems(loaded.items);
        }
      })
      .catch((caught: unknown) => {
        if (caught instanceof NotAuthenticatedError) {
          return;
        }
        setError(describeError(caught, "Не удалось загрузить пробники."));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = async () => {
    if (!history) {
      return;
    }
    setIsLoadingMore(true);
    setError(null);
    try {
      const next = await fetchAttemptHistory(items.length);
      setHistory(next);
      setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [
          ...current,
          ...next.items.filter((item) => !known.has(item.id)),
        ];
      });
    } catch (caught) {
      if (!(caught instanceof NotAuthenticatedError)) {
        setError(describeError(caught, "Не удалось загрузить ещё."));
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!history) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <p className="w-full text-center text-sm text-ink-faint">
          {error ?? "Загружаем пробники…"}
        </p>
      </main>
    );
  }

  const active = history.summary.activeAttemptId;
  const hasMore = items.length < history.totalCount;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-[32px] font-medium tracking-[-0.8px] text-ink lg:text-4xl">
          Мои пробники
        </h1>
        {active === null ? (
          <Link
            href={routes.examSetup}
            className="text-[13px] font-medium text-ink-soft hover:underline"
          >
            Собрать новый вариант →
          </Link>
        ) : (
          <Link
            href={routes.exam(active)}
            className="text-[13px] font-medium text-ink-soft hover:underline"
          >
            Продолжить текущий экзамен →
          </Link>
        )}
      </header>

      <HistorySummary summary={history.summary} />

      {items.length === 0 ? (
        <Surface className="flex flex-col items-start gap-4 p-6 sm:p-9">
          <p className="max-w-[520px] text-base text-ink">
            Пока ни одного пробника. Соберите вариант — три обязательных
            предмета уже в нём, останется выбрать два профильных.
          </p>
          <Link href={routes.examSetup}>
            <Button>Собрать вариант</Button>
          </Link>
        </Surface>
      ) : (
        <>
          <AttemptsTable items={items} />
          <footer className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-faint">
              {items.length === 1 ? "Показана" : "Показаны"} {items.length} из{" "}
              {history.totalCount}{" "}
              {pluralize(history.totalCount, ["попытки", "попыток", "попыток"])}
            </p>
            {hasMore ? (
              <Button
                variant="secondary"
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Загружаем…" : "Показать ещё"}
              </Button>
            ) : null}
          </footer>
          {error ? (
            <p role="alert" className="text-[13px] text-ink-soft">
              {error}
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
