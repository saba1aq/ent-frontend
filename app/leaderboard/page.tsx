import type { Metadata } from "next";

import { RequireSession } from "@/entities/session";
import { LeaderboardPage } from "@/views/leaderboard";

export const metadata: Metadata = { title: "Рейтинг" };

export default function Page() {
  return (
    <RequireSession>
      <LeaderboardPage />
    </RequireSession>
  );
}
