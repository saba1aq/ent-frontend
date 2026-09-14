import { LogOut } from "lucide-react";

import type { SessionUser } from "@/entities/session";
import { formatPhone, phoneDigits } from "@/shared/lib/phone";

export function SidebarUser({
  user,
  isCollapsed,
  onSignOut,
}: {
  user: SessionUser | null;
  isCollapsed: boolean;
  onSignOut: () => void;
}) {
  const name = fullName(user);
  const initials = initialsOf(user);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span
          title={name}
          className="flex size-8 items-center justify-center rounded-full bg-ink-strong text-[11px] font-semibold text-white"
        >
          {initials}
        </span>
        <button
          type="button"
          onClick={onSignOut}
          title="Выйти"
          aria-label="Выйти"
          className="press-tight flex size-8 cursor-pointer items-center justify-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
        >
          <LogOut className="size-[17px]" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-strong text-[11px] font-semibold text-white">
        {initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-medium text-ink-strong">{name}</span>
        <span className="truncate text-[11px] text-ink-faint">
          {user ? formatPhone(phoneDigits(user.phone)) : " "}
        </span>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        title="Выйти"
        aria-label="Выйти"
        className="press-tight flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
      >
        <LogOut className="size-[17px]" aria-hidden />
      </button>
    </div>
  );
}

function fullName(user: SessionUser | null): string {
  if (!user) {
    return "Ученик";
  }
  const name = [user.firstName, user.lastName].filter((part) => part.trim()).join(" ");
  return name || "Ученик";
}

function initialsOf(user: SessionUser | null): string {
  if (!user) {
    return "У";
  }
  const letters = [user.firstName, user.lastName]
    .map((part) => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("");
  return letters || "У";
}
