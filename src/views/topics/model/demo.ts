export type DemoTopic = {
  name: string;
  questionCount: number;
  slug?: string;
};

export type DemoSection = {
  name: string;
  topicCount: number;
  topics: DemoTopic[];
};

export type DemoSubject = {
  name: string;
  topicCount: number;
};

export const DEMO_SUBJECTS: DemoSubject[] = [{ name: "История Казахстана", topicCount: 128 }];

export const DEMO_SUBJECT = DEMO_SUBJECTS[0];

export const DEMO_TOTALS = {
  sectionCount: 6,
  topicCount: 128,
  questionCount: 1240,
};

export const DEMO_SECTIONS: DemoSection[] = [
  { name: "Древний Казахстан", topicCount: 18, topics: [] },
  {
    name: "Средневековые государства",
    topicCount: 22,
    topics: [
      { name: "Тюркский каганат", questionCount: 24, slug: "tyurkskiy-kaganat" },
      { name: "Караханиды и кыпчаки", questionCount: 20, slug: "karahanidy-i-kypchaki" },
      { name: "Монгольское нашествие", questionCount: 18, slug: "mongolskoe-nashestvie" },
      { name: "Образование Казахского ханства", questionCount: 26 },
      { name: "Казахские жузы: формирование", questionCount: 16 },
    ],
  },
  {
    name: "Казахстан в XVIII–XIX веках",
    topicCount: 24,
    topics: [
      { name: "Джунгарское нашествие. Анракайская битва", questionCount: 22 },
      { name: "Присоединение к Российской империи", questionCount: 28 },
      { name: "Реформы 1867–1868 годов", questionCount: 24 },
      { name: "Восстание Кенесары Касымулы", questionCount: 20 },
      { name: "Национальная интеллигенция XIX века", questionCount: 18 },
    ],
  },
  {
    name: "Казахстан в начале XX века",
    topicCount: 21,
    topics: [
      { name: "Алаш и Алашорда", questionCount: 26 },
      { name: "Голод 1921–1922 годов", questionCount: 14 },
      { name: "Индустриализация и коллективизация", questionCount: 22 },
    ],
  },
  { name: "Советский период", topicCount: 25, topics: [] },
  { name: "Независимый Казахстан", topicCount: 18, topics: [] },
];
