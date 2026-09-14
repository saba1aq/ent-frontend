import type { Metadata } from "next";

import { LeaderboardPage } from "@/views/leaderboard";

export const metadata: Metadata = { title: "Рейтинг" };

export default function Page() {
  return (
      <LeaderboardPage />
  );
}
