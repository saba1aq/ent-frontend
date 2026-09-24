import type { Language } from "@/shared/config/language";

export type ContactKind = "telegram" | "phone";

export type WaitlistRequest = {
  name: string;
  contactKind: ContactKind;
  contact: string;
  language: Language;
  profileSubjects: string[];
  consent: boolean;
};

export class WaitlistError extends Error {}

export async function joinWaitlist(request: WaitlistRequest): Promise<void> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new WaitlistError(`waitlist ${response.status}`);
  }
}
