import type { SubjectPair } from "../model/types";

export function isPairAllowed(pairs: readonly SubjectPair[], first: string, second: string): boolean {
  return pairs.some(
    ([left, right]) => (left === first && right === second) || (left === second && right === first),
  );
}
