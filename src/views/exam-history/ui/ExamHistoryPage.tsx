"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { type AttemptHistory, type AttemptHistoryItem, fetchAttemptHistory } from "@/entities/attempt";
import { fetchStreak, type Streak, StreakCard } from "@/entities/streak";
import { describeError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { pluralize } from "@/shared/lib/format";
import { showToast } from "@/shared/lib/toast-store";
import { Button, SectionLabel, Spinner, Surface } from "@/shared/ui";

import { AttemptsTable } from "./AttemptsTable";
import { HistorySummary } from "./HistorySummary";


export function ExamHistoryPage() {
  const [history, setHistory] = useState<AttemptHistory | null>(null);
  const [items, setItems] = useState<AttemptHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [streak, setStreak] = useState<Streak | null>(null);

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
        const message = describeError(caught, "Не удалось загрузить пробники.");
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
        return [...current, ...next.items.filter((item) => !known.has(item.id))];
      });
    } catch (caught) {
      if (!(caught instanceof NotAuthenticatedError)) {
        const message = describeError(caught, "Не удалось загрузить ещё.");
        showToast(message);
        setError(message);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!history) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
        {error ? (
          <p role="alert" className="text-center text-sm text-wrong">
            {error}
          </p>
        ) : (
          <p className="flex items-center gap-2.5 text-sm text-ink-muted">
            <Spinner className="text-ink-faint" />
            Загружаем пробники…
          </p>
        )}
      </main>
    );
  }

  const active = history.summary.activeAttemptId;
  const hasMore = items.length < history.totalCount;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2">
          <SectionLabel>История</SectionLabel>
          <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.9px] text-ink-strong lg:text-[40px]">
            Мои пробники
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button as={Link} href={routes.leaderboard} variant="secondary">
            Рейтинг
          </Button>
          {active === null ? (
            <Button as={Link} href={routes.examSetup}>
              Собрать новый вариант
            </Button>
          ) : (
            <Button as={Link} href={routes.exam(active)}>
              Продолжить текущий экзамен
            </Button>
          )}
        </div>
      </header>

      {streak ? <StreakCard streak={streak} /> : null}

      <HistorySummary summary={history.summary} />

      {items.length === 0 ? (
        <Surface className="flex flex-col items-start gap-5 p-6 sm:p-9">
          <p className="max-w-[520px] text-base/7 text-ink-soft">
            Пока ни одного пробника. Соберите вариант — три обязательных предмета уже в нём, останется выбрать два
            профильных.
          </p>
          <Button as={Link} href={routes.examSetup} size="lg">
            Собрать вариант
          </Button>
        </Surface>
      ) : (
        <>
          <AttemptsTable items={items} />
          <footer className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-ink-faint">
              {items.length === 1 ? "Показана" : "Показаны"} {items.length} из {history.totalCount}{" "}
              {pluralize(history.totalCount, ["попытки", "попыток", "попыток"])}
            </p>
            {hasMore ? (
              <Button variant="secondary" onClick={loadMore} loading={isLoadingMore}>
                Показать ещё
              </Button>
            ) : null}
          </footer>
          {error ? (
            <p role="alert" className="text-[13px] text-wrong">
              {error}
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
