import type { Language } from "@/shared/config/language";

const RU_QUESTION_FORMS = ["вопрос", "вопроса", "вопросов"] as const;

function pickRussianForm(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo > 10 && lastTwo < 20) {
    return RU_QUESTION_FORMS[2];
  }
  if (last === 1) {
    return RU_QUESTION_FORMS[0];
  }
  if (last >= 2 && last <= 4) {
    return RU_QUESTION_FORMS[1];
  }
  return RU_QUESTION_FORMS[2];
}

export function formatQuestionCount(count: number, language: Language): string {
  if (language === "kk") {
    return `${count} сұрақ`;
  }
  return `${count} ${pickRussianForm(count)}`;
}

export function formatMinutes(minutes: number, language: Language): string {
  return language === "kk" ? `${minutes} мин` : `${minutes} мин`;
}

export function formatDuration(minutes: number, language: Language): string {
  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? hours : Math.round(hours * 10) / 10;

  if (language === "kk") {
    return `${rounded} сағат`;
  }

  const lastTwo = rounded % 100;
  const last = rounded % 10;
  if (lastTwo > 10 && lastTwo < 20) {
    return `${rounded} часов`;
  }
  if (last === 1) {
    return `${rounded} час`;
  }
  if (last >= 2 && last <= 4) {
    return `${rounded} часа`;
  }
  return `${rounded} часов`;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatSpentMinutes(totalSeconds: number, language: Language): string {
  return formatMinutes(Math.round(totalSeconds / 60), language);
}

export function pluralize(count: number, forms: [string, string, string]): string {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo > 10 && lastTwo < 20) {
    return forms[2];
  }
  if (last === 1) {
    return forms[0];
  }
  if (last >= 2 && last <= 4) {
    return forms[1];
  }
  return forms[2];
}

const RU_SHORT_MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"] as const;

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${RU_SHORT_MONTHS[date.getMonth()]}`;
}

export function formatHoursMinutes(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest} мин`;
  }
  return rest === 0 ? `${hours} ч` : `${hours} ч ${rest} мин`;
}
