import type { Language } from "@/shared/config/language";

import { subjectName, UNDECIDED_LABEL } from "../model/profile-subjects";
import type { WaitlistRequest } from "./waitlist-api";

const NOTION_PAGES_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

const LANGUAGE_LABELS: Record<Language, string> = {
  kk: "Қазақша",
  ru: "Русский",
};

type RichText = { text: { content: string; link?: { url: string } } };

function contactText(request: WaitlistRequest): RichText {
  if (request.contactKind === "telegram") {
    return { text: { content: `@${request.contact}`, link: { url: `https://t.me/${request.contact}` } } };
  }
  return { text: { content: request.contact } };
}

function subjectOptions(request: WaitlistRequest) {
  const names = request.profileSubjects.length
    ? request.profileSubjects.map((code) => subjectName(code) ?? code)
    : [UNDECIDED_LABEL];
  return names.map((name) => ({ name }));
}

export async function saveToNotion(request: WaitlistRequest): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error("NOTION_TOKEN или NOTION_WAITLIST_DATABASE_ID не заданы");
  }

  const response = await fetch(NOTION_PAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Имя: { title: [{ text: { content: request.name } }] },
        Контакт: { rich_text: [contactText(request)] },
        "Способ связи": { select: { name: request.contactKind === "telegram" ? "Telegram" : "Телефон" } },
        "Язык сдачи": { select: { name: LANGUAGE_LABELS[request.language] } },
        Предметы: { multi_select: subjectOptions(request) },
        Согласие: { checkbox: request.consent },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Notion ${response.status}: ${await response.text()}`);
  }
}
