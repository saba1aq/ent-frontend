"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { type AttemptHistory, type AttemptHistoryItem, fetchAttemptHistory } from "@/entities/attempt";
import { describeError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { pluralize } from "@/shared/lib/format";
import { showToast } from "@/shared/lib/toast-store";
import { Button, PageContainer, PageState, SectionLabel, Surface } from "@/shared/ui";

import { AttemptsTable } from "./AttemptsTable";
import { HistorySummary } from "./HistorySummary";


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
        const message = describeError(caught, "Не удалось загрузить пробники.");
        showToast(message);
        setError(message);
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
<PageState tone={error ? "error" : "loading"} message={error ?? "Загружаем пробники…"} />
    );
  }

  const active = history.summary.activeAttemptId;
  const hasMore = items.length < history.totalCount;

  return (
    <PageContainer>
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2">
          <SectionLabel>История</SectionLabel>
          <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.9px] text-ink-strong lg:text-[40px]">
            Мои пробники
          </h1>
        </div>
        {active === null ? null : (
          <Button as={Link} href={routes.exam(active)}>
            Продолжить пробник
          </Button>
        )}
      </header>

      <HistorySummary summary={history.summary} />

      {items.length === 0 ? (
        <Surface className="flex flex-col items-start gap-5 p-6 sm:p-9">
          <p className="max-w-[520px] text-base/7 text-ink-soft">
            Пока ни одного пробника. Соберите свой — три обязательных предмета уже внутри, останется выбрать два
            профильных.
          </p>
          <Button as={Link} href={routes.examSetup} size="lg">
            Новый пробник
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
    </PageContainer>
  );
}
