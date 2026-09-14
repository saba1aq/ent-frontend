"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createAttempt, listAttempts } from "@/entities/attempt";
import { useSessionStatus } from "@/entities/session";
import { ApiError } from "@/shared/api";
import type { Language } from "@/shared/config/language";
import { routes, withNext } from "@/shared/config/routes";

import { savePendingExamSetup } from "./exam-setup-store";

export function useStartExam(language: Language, profileCodes: readonly string[]) {
  const router = useRouter();
  const status = useSessionStatus();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setError(null);
    if (status !== "authenticated") {
      savePendingExamSetup({ language, profileSubjects: [...profileCodes] });
      router.push(withNext(routes.signIn, routes.examSetup));
      return;
    }
    setIsStarting(true);
    try {
      const attempt = await createAttempt(language, [...profileCodes]);
      router.push(routes.exam(attempt.id));
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "active_attempt_exists") {
        const active = (await listAttempts().catch(() => [])).find((item) => item.status === "in_progress");
        if (active) {
          router.push(routes.exam(active.id));
          return;
        }
      }
      setError(caught instanceof ApiError ? caught.message : "Не удалось начать экзамен.");
      setIsStarting(false);
    }
  };

  return { start, isStarting, error, isAuthenticated: status === "authenticated" };
}
