export type StreakDay = {
  day: string;
  isActive: boolean;
};

export type Streak = {
  currentDays: number;
  bestDays: number;
  activeToday: boolean;
  totalActiveDays: number;
  lastActiveDay: string | null;
  week: StreakDay[];
};
