export const routes = {
  home: "/",
  examSetup: "/exam/setup",
  exams: "/exams",
  leaderboard: "/leaderboard",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  forgotPassword: "/auth/forgot-password",
  exam: (attemptId: number | string) => `/exam/${attemptId}`,
  examResults: (attemptId: number | string) => `/exam/${attemptId}/results`,
  examReview: (attemptId: number | string, questionId: number | string) => `/exam/${attemptId}/review/${questionId}`,
} as const;

export function withNext(path: string, next: string | null | undefined): string {
  if (!next || !next.startsWith("/")) {
    return path;
  }
  return `${path}?next=${encodeURIComponent(next)}`;
}

export function safeNext(next: string | string[] | undefined, fallback: string): string {
  const value = Array.isArray(next) ? next[0] : next;
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
