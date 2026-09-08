import { authorizedRequest } from "@/shared/api";
import { camelizeKeys } from "@/shared/lib/camelize";

import type { Leaderboard, LeaderboardPeriod } from "../model/types";

export async function fetchLeaderboard(period: LeaderboardPeriod): Promise<Leaderboard> {
  const dto = await authorizedRequest<unknown>(`/api/v1/attempts/leaderboard/?period=${period}&limit=50`);
  return camelizeKeys<Leaderboard>(dto);
}
