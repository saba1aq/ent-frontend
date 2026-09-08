"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  addTimeSpent,
  type AttemptOverview,
  fetchAttempt,
  fetchQuestion,
  finishAttempt,
  type QuestionDetail,
  saveAnswer,
  toggleFlag,
} from "@/entities/attempt";
import { ApiError, NotAuthenticatedError } from "@/shared/api";
import { routes } from "@/shared/config/routes";

const CLOSED_CODES = new Set(["attempt_expired", "attempt_not_active"]);

export type FlatQuestion = {
  id: number;
  number: number;
  sectionId: number;
  isAnswered: boolean;
  isFlagged: boolean;
};

function flatten(overview: AttemptOverview): FlatQuestion[] {
  return overview.sections.flatMap((section) =>
    section.questions.map((question) => ({ ...question, sectionId: section.id })),
  );
}

function firstUnanswered(overview: AttemptOverview): number | null {
  const flat = flatten(overview);
  return (flat.find((question) => !question.isAnswered) ?? flat[0])?.id ?? null;
}

function patchOverview(
  overview: AttemptOverview,
  questionId: number,
  patch: Partial<Pick<FlatQuestion, "isAnswered" | "isFlagged">>,
): AttemptOverview {
  return {
    ...overview,
    sections: overview.sections.map((section) => {
      if (!section.questions.some((question) => question.id === questionId)) {
        return section;
      }
      const questions = section.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      );
      return { ...section, questions, answeredCount: questions.filter((question) => question.isAnswered).length };
    }),
  };
}

export function useExamRun(attemptId: string) {
  const router = useRouter();
  const [overview, setOverview] = useState<AttemptOverview | null>(null);
  const [details, setDetails] = useState<Record<number, QuestionDetail>>({});
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [overviewMode, setOverviewMode] = useState<"closed" | "review" | "finish">("closed");
  const clockOffsetRef = useRef(0);
  const enteredAtRef = useRef<number>(0);
  const finishingRef = useRef(false);

  const goToResults = useCallback(() => router.replace(routes.examResults(attemptId)), [router, attemptId]);

  const handleError = useCallback(
    (caught: unknown) => {
      if (caught instanceof NotAuthenticatedError) {
        return;
      }
      if (caught instanceof ApiError && caught.code && CLOSED_CODES.has(caught.code)) {
        goToResults();
        return;
      }
      setError(caught instanceof ApiError ? caught.message : "Что-то пошло не так. Проверьте соединение.");
    },
    [goToResults],
  );

  useEffect(() => {
    let cancelled = false;
    fetchAttempt(attemptId)
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        if (loaded.status !== "in_progress") {
          goToResults();
          return;
        }
        clockOffsetRef.current = Date.parse(loaded.serverTime) - Date.now();
        setOverview(loaded);
        setCurrentId(firstUnanswered(loaded));
      })
      .catch(handleError);
    return () => {
      cancelled = true;
    };
  }, [attemptId, goToResults, handleError]);

  useEffect(() => {
    if (currentId === null || details[currentId]) {
      return;
    }
    let cancelled = false;
    fetchQuestion(attemptId, currentId)
      .then((detail) => {
        if (!cancelled) {
          setDetails((previous) => ({ ...previous, [detail.id]: detail }));
        }
      })
      .catch(handleError);
    return () => {
      cancelled = true;
    };
  }, [attemptId, currentId, details, handleError]);

  useEffect(() => {
    enteredAtRef.current = Date.now();
    const leavingId = currentId;
    return () => {
      const seconds = Math.round((Date.now() - enteredAtRef.current) / 1000);
      if (leavingId !== null && seconds >= 1 && !finishingRef.current) {
        void addTimeSpent(attemptId, leavingId, seconds).catch(() => undefined);
      }
    };
  }, [attemptId, currentId]);

  const finish = useCallback(async () => {
    if (finishingRef.current || !overview) {
      return;
    }
    finishingRef.current = true;
    setIsFinishing(true);
    try {
      if (currentId !== null) {
        const seconds = Math.round((Date.now() - enteredAtRef.current) / 1000);
        if (seconds >= 1) {
          await addTimeSpent(attemptId, currentId, seconds).catch(() => undefined);
        }
      }
      await finishAttempt(attemptId);
      goToResults();
    } catch (caught) {
      finishingRef.current = false;
      setIsFinishing(false);
      handleError(caught);
    }
  }, [attemptId, currentId, goToResults, handleError, overview]);

  useEffect(() => {
    if (!overview) {
      return;
    }
    const deadline = Date.parse(overview.deadlineAt);
    const tick = () => {
      const left = Math.floor((deadline - (Date.now() + clockOffsetRef.current)) / 1000);
      setRemainingSeconds(Math.max(0, left));
      if (left <= 0) {
        void finish();
      }
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [overview, finish]);

  const flat = useMemo(() => (overview ? flatten(overview) : []), [overview]);
  const currentIndex = flat.findIndex((question) => question.id === currentId);
  const currentDetail = currentId !== null ? details[currentId] : undefined;
  const currentSection = overview?.sections.find((section) => section.id === currentDetail?.sectionId)
    ?? overview?.sections.find((section) => section.questions.some((question) => question.id === currentId));

  const selectOption = useCallback(
    (optionId: number) => {
      if (!currentDetail || !overview) {
        return;
      }
      const isMultiple = currentDetail.kind === "multiple";
      const wasSelected = currentDetail.selectedOptionIds.includes(optionId);
      const nextSelection = isMultiple
        ? wasSelected
          ? currentDetail.selectedOptionIds.filter((id) => id !== optionId)
          : [...currentDetail.selectedOptionIds, optionId]
        : [optionId];

      setDetails((previous) => ({ ...previous, [currentDetail.id]: { ...currentDetail, selectedOptionIds: nextSelection } }));
      setOverview((previous) => (previous ? patchOverview(previous, currentDetail.id, { isAnswered: nextSelection.length > 0 }) : previous));

      saveAnswer(attemptId, currentDetail.id, nextSelection).catch((caught) => {
        setDetails((previous) => ({ ...previous, [currentDetail.id]: currentDetail }));
        setOverview((previous) =>
          previous ? patchOverview(previous, currentDetail.id, { isAnswered: currentDetail.selectedOptionIds.length > 0 }) : previous,
        );
        handleError(caught);
      });
    },
    [attemptId, currentDetail, handleError, overview],
  );

  const flag = useCallback(() => {
    if (!currentDetail) {
      return;
    }
    const nextFlag = !currentDetail.isFlagged;
    setDetails((previous) => ({ ...previous, [currentDetail.id]: { ...currentDetail, isFlagged: nextFlag } }));
    setOverview((previous) => (previous ? patchOverview(previous, currentDetail.id, { isFlagged: nextFlag }) : previous));
    toggleFlag(attemptId, currentDetail.id).catch((caught) => {
      setDetails((previous) => ({ ...previous, [currentDetail.id]: currentDetail }));
      setOverview((previous) => (previous ? patchOverview(previous, currentDetail.id, { isFlagged: currentDetail.isFlagged }) : previous));
      handleError(caught);
    });
  }, [attemptId, currentDetail, handleError]);

  const goTo = useCallback((questionId: number) => {
    setCurrentId(questionId);
    setOverviewMode("closed");
  }, []);

  const openOverview = useCallback(() => setOverviewMode("review"), []);
  const openFinish = useCallback(() => setOverviewMode("finish"), []);
  const closeOverview = useCallback(() => setOverviewMode("closed"), []);

  return {
    overview,
    flat,
    currentDetail,
    currentSection,
    currentIndex,
    previousId: currentIndex > 0 ? flat[currentIndex - 1].id : null,
    nextId: currentIndex >= 0 && currentIndex < flat.length - 1 ? flat[currentIndex + 1].id : null,
    remainingSeconds,
    error,
    isFinishing,
    overviewMode,
    openOverview,
    openFinish,
    closeOverview,
    goTo,
    selectOption,
    flag,
    finish,
    dismissError: () => setError(null),
  };
}
