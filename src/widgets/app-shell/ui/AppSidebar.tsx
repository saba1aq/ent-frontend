"use client";

import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { fetchMe, type SessionUser, signOut } from "@/entities/session";
import { fetchStreak, type Streak } from "@/entities/streak";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { Logo, LogoMark } from "@/shared/ui";

import { NAV_ITEMS } from "../model/nav-items";
import { getSidebarCollapsed, getSidebarCollapsedServer, subscribeSidebar, toggleSidebar } from "../model/sidebar-store";
import { SidebarStreak } from "./SidebarStreak";
import { SidebarUser } from "./SidebarUser";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isCollapsed = useSyncExternalStore(subscribeSidebar, getSidebarCollapsed, getSidebarCollapsedServer);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchStreak()
      .then((loaded) => {
        if (!cancelled) {
          setStreak(loaded);
        }
      })
      .catch(() => undefined);
    fetchMe()
      .then((loaded) => {
        if (!cancelled) {
          setUser(loaded);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const leave = async () => {
    await signOut();
    router.replace(routes.home);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col gap-4 overflow-hidden border-r border-line bg-surface py-5 transition-[width] duration-200 ease-in-out lg:flex",
        isCollapsed ? "w-[72px] px-3" : "w-[248px] px-4",
      )}
    >
      <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "justify-between gap-2")}>
        {isCollapsed ? (
          <Link
            href={routes.exams}
            aria-label="upstudy"
            className="press flex items-center justify-center rounded-md text-ink-strong"
          >
            <LogoMark className="size-10" />
          </Link>
        ) : (
          <Logo as={Link} href={routes.exams} size="md" className="press rounded-md px-1 py-1" />
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
          className="press-tight flex size-8 cursor-pointer items-center justify-center rounded-md text-ink-faint hover:bg-sunken hover:text-ink"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-[18px]" aria-hidden />
          ) : (
            <PanelLeftClose className="size-[18px]" aria-hidden />
          )}
        </button>
      </div>

      <Link
        href={routes.examSetup}
        title={isCollapsed ? "Новый пробник" : undefined}
        className={cn(
          "press flex h-10 items-center gap-2 rounded-md bg-accent text-sm font-semibold text-white shadow-card hover:bg-accent-hover",
          isCollapsed ? "justify-center px-0" : "px-3.5",
        )}
      >
        <Plus className="size-4 shrink-0" aria-hidden />
        {isCollapsed ? null : "Новый пробник"}
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.matches(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "press relative flex h-10 items-center gap-3 rounded-md text-sm transition-colors duration-150 ease-out",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive
                  ? "bg-sunken font-semibold text-ink-strong before:absolute before:top-2 before:bottom-2 before:left-0 before:w-[3px] before:rounded-full before:bg-accent before:content-['']"
                  : "text-ink-soft hover:bg-sunken hover:text-ink",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              {isCollapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-auto flex flex-col gap-3", isCollapsed ? "items-center" : null)}>
        {streak ? <SidebarStreak streak={streak} isCollapsed={isCollapsed} /> : null}
        <div className={cn("w-full border-t border-line pt-4", isCollapsed ? "flex justify-center" : null)}>
          <SidebarUser user={user} isCollapsed={isCollapsed} onSignOut={leave} />
        </div>
      </div>
    </aside>
  );
}
