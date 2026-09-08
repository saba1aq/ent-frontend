import type { Language } from "@/shared/config/language";

type ExamSetupTexts = {
  title: string;
  panelTitle: string;
  examLanguage: string;
  testLanguageNames: Record<Language, string>;
  totalQuestions: string;
  maxScore: string;
  examDuration: string;
  pauseWarning: string;
  startButton: string;
  hintPickTwo: string;
  hintPickSecond: string;
  emptySlotLabel: string;
  emptySlotSummary: string;
  requiredSectionLabel: string;
  profileSectionLabel: string;
};

export const EXAM_SETUP_TEXTS: Record<Language, ExamSetupTexts> = {
  ru: {
    title: "Соберите свой вариант ЕНТ",
    panelTitle: "ВАШ ВАРИАНТ",
    examLanguage: "Язык сдачи",
    testLanguageNames: { kk: "Казахский", ru: "Русский" },
    totalQuestions: "Всего вопросов",
    maxScore: "Максимум баллов",
    examDuration: "Время на тест",
    pauseWarning: "Тест нельзя поставить на паузу. Начинайте, когда у вас есть 4 свободных часа.",
    startButton: "Перейти к тесту",
    hintPickTwo: "Выберите два профильных предмета, чтобы продолжить",
    hintPickSecond: "Выберите второй предмет, чтобы продолжить",
    emptySlotLabel: "{n}-й предмет",
    emptySlotSummary: "{n}-й предмет не выбран",
    requiredSectionLabel: "Обязательные предметы",
    profileSectionLabel: "Профильные предметы",
  },
  kk: {
    title: "ҰБТ нұсқаңызды құрастырыңыз",
    panelTitle: "СІЗДІҢ НҰСҚАҢЫЗ",
    examLanguage: "Тапсыру тілі",
    testLanguageNames: { kk: "Қазақша", ru: "Орысша" },
    totalQuestions: "Сұрақтар саны",
    maxScore: "Максималды балл",
    examDuration: "Тестке берілетін уақыт",
    pauseWarning: "Тестті кідірту мүмкін емес. 4 сағат бос уақытыңыз болғанда бастаңыз.",
    startButton: "Тестке өту",
    hintPickTwo: "Жалғастыру үшін екі бейіндік пәнді таңдаңыз",
    hintPickSecond: "Жалғастыру үшін екінші пәнді таңдаңыз",
    emptySlotLabel: "{n}-ші пән",
    emptySlotSummary: "{n}-ші пән таңдалмаған",
    requiredSectionLabel: "Міндетті пәндер",
    profileSectionLabel: "Бейіндік пәндер",
  },
};
