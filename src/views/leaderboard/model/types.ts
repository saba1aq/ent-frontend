export type LeaderboardPeriod = "all" | "week" | "today";

export type LeaderboardRow = {
  rank: number;
  displayName: string;
  bestScore: number;
  maxScore: number;
  averageScore: number;
  attemptCount: number;
  streakDays: number;
  lastAttemptAt: string | null;
  isMe: boolean;
};

export type Leaderboard = {
  period: LeaderboardPeriod;
  rows: LeaderboardRow[];
  me: LeaderboardRow | null;
  totalParticipants: number;
};
