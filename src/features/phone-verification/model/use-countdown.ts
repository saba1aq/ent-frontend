"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds: number, resetKey: unknown): number {
  const endsAtRef = useRef(0);
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    endsAtRef.current = Date.now() + seconds * 1000;
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000)));
    }, 250);
    return () => window.clearInterval(interval);
  }, [seconds, resetKey]);

  return remaining;
}
