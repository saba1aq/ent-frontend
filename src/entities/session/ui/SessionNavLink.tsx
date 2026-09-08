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
    "press -mx-2 inline-flex w-fit items-center rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink",
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
