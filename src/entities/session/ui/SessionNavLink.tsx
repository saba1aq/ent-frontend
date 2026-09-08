"use client";

import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

import { useSessionStatus } from "../model/session-store";

type SessionNavLinkProps = {
  className?: string;
  showSignIn?: boolean;
};

export function SessionNavLink({
  className,
  showSignIn = true,
}: SessionNavLinkProps) {
  const status = useSessionStatus();
  const classes = cn(
    "text-[13px] font-medium text-ink-soft hover:underline",
    className,
  );

  if (status === "authenticated") {
    return (
      <Link href={routes.exams} className={classes}>
        Мои пробники
      </Link>
    );
  }
  if (status === "anonymous" && showSignIn) {
    return (
      <Link href={routes.signIn} className={classes}>
        Войти
      </Link>
    );
  }
  return (
    <span className={cn(classes, "invisible")} aria-hidden>
      Мои пробники
    </span>
  );
}
