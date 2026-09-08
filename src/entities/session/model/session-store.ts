"use client";

import { useMemo, useSyncExternalStore } from "react";

import { readTokensRaw, subscribeTokens } from "@/shared/api";

import type { SessionStatus } from "./types";

function getServerSnapshot(): string | null {
  return null;
}

export function useSessionStatus(): SessionStatus {
  const raw = useSyncExternalStore(subscribeTokens, readTokensRaw, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return useMemo<SessionStatus>(() => {
    if (!isHydrated) {
      return "unknown";
    }
    return raw ? "authenticated" : "anonymous";
  }, [isHydrated, raw]);
}
