"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";

import { NAV_ITEMS } from "../model/nav-items";

export function MobileTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = item.matches(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "press flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ease-out",
              isActive ? "text-accent-strong" : "text-ink-muted",
            )}
          >
            <Icon className="size-[19px]" aria-hidden />
            {item.shortLabel}
          </Link>
        );
      })}
      <Link
        href={routes.examSetup}
        className="press flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-muted transition-colors duration-150 ease-out"
      >
        <Plus className="size-[19px]" aria-hidden />
        Собрать
      </Link>
    </nav>
  );
}
