"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { routes, withNext } from "@/shared/config/routes";

import { useSessionStatus } from "../model/session-store";

type RequireSessionProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function RequireSession({ children, fallback = null }: RequireSessionProps) {
  const status = useSessionStatus();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "anonymous") {
      router.replace(withNext(routes.signIn, pathname));
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return fallback;
  }
  return children;
}
