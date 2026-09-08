import { authorizedRequest } from "@/shared/api";
import { camelizeKeys } from "@/shared/lib/camelize";

import type { Streak } from "../model/types";

export async function fetchStreak(): Promise<Streak> {
  return camelizeKeys<Streak>(await authorizedRequest<unknown>("/api/v1/attempts/streak/"));
}
