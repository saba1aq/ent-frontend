import type { SubjectPair } from "@/entities/subject";

export type ProfileSubject = {
  code: string;
  name: string;
  icon: string;
};

export const PROFILE_SUBJECTS: ProfileSubject[] = [
  { code: "mathematics", name: "Математика", icon: "sigma" },
  { code: "physics", name: "Физика", icon: "atom" },
  { code: "informatics", name: "Информатика", icon: "cpu" },
  { code: "chemistry", name: "Химия", icon: "flask-conical" },
  { code: "biology", name: "Биология", icon: "leaf" },
  { code: "geography", name: "География", icon: "globe" },
  { code: "world-history", name: "Всемирная история", icon: "landmark" },
  { code: "law", name: "Основы права", icon: "scale" },
  { code: "foreign-language", name: "Иностранный язык", icon: "languages" },
  { code: "kazakh-language", name: "Казахский язык", icon: "languages" },
  { code: "kazakh-literature", name: "Казахская литература", icon: "book-open" },
  { code: "russian-language", name: "Русский язык", icon: "languages" },
  { code: "russian-literature", name: "Русская литература", icon: "book-open" },
];

export const PROFILE_PAIRS: SubjectPair[] = [
  ["mathematics", "physics"],
  ["mathematics", "informatics"],
  ["mathematics", "geography"],
  ["physics", "chemistry"],
  ["biology", "chemistry"],
  ["biology", "geography"],
  ["world-history", "geography"],
  ["world-history", "law"],
  ["world-history", "foreign-language"],
  ["geography", "foreign-language"],
  ["kazakh-language", "kazakh-literature"],
  ["russian-language", "russian-literature"],
];

export const UNDECIDED_LABEL = "Ещё не решил(а)";

export function subjectName(code: string): string | undefined {
  return PROFILE_SUBJECTS.find((subject) => subject.code === code)?.name;
}
