import { ClipboardList, Layers, Trophy } from "lucide-react";

import { routes } from "@/shared/config/routes";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof Trophy;
  matches: (pathname: string) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: routes.exams,
    label: "Мои пробники",
    shortLabel: "Пробники",
    icon: ClipboardList,
    matches: (pathname) => pathname === routes.exams || pathname.startsWith("/exam/"),
  },
  {
    href: routes.topics,
    label: "Задания по темам",
    shortLabel: "Темы",
    icon: Layers,
    matches: (pathname) => pathname.startsWith(routes.topics),
  },
  {
    href: routes.leaderboard,
    label: "Рейтинг",
    shortLabel: "Рейтинг",
    icon: Trophy,
    matches: (pathname) => pathname.startsWith(routes.leaderboard),
  },
];
