export type LaunchMode = "waitlist" | "live";

export const LAUNCH_MODE: LaunchMode = process.env.NEXT_PUBLIC_LAUNCH_MODE === "live" ? "live" : "waitlist";

export const IS_WAITLIST = LAUNCH_MODE === "waitlist";
