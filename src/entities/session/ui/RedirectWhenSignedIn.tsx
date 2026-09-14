"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSessionStatus } from "../model/session-store";

type RedirectWhenSignedInProps = {
  to: string;
};

export function RedirectWhenSignedIn({ to }: RedirectWhenSignedInProps) {
  const status = useSessionStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(to);
    }
  }, [router, status, to]);

  return null;
}
