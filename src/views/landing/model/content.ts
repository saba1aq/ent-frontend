export const LAUNCH_NOTE = "Запуск в октябре 2026";

export const FACTS = [
  { value: "120", label: "вопросов в варианте" },
  { value: "4 часа", label: "как на настоящем ЕНТ" },
  { value: "2015–2026", label: "задания из сборников ЕНТ и новые вопросы от опытных учителей" },
];

export type ExampleOption = {
  letter: string;
  text: string;
  state: "picked" | "correct" | "idle";
};

export const EXAMPLE = {
  meta: "История Казахстана · вопрос 7 из 20",
  question: "В каком году произошла Анракайская битва?",
  options: [
    { letter: "A", text: "1723", state: "picked" },
    { letter: "B", text: "1730", state: "correct" },
    { letter: "C", text: "1741", state: "idle" },
    { letter: "D", text: "1758", state: "idle" },
  ] satisfies ExampleOption[],
  explanation: [
    "Вы выбрали 1723 — это год, когда началось джунгарское нашествие, «Ақтабан шұбырынды».",
    "Анракайская битва — ответный удар казахского ополчения семь лет спустя, в 1730 году, и крупнейшая победа над джунгарами.",
  ],
  tip: "Как запомнить: 1723 — беда, 1730 — перелом.",
};

export type PriceTier = {
  name: string;
  price: string;
  period: string;
  perks: string[];
  note?: string;
  featured?: boolean;
};

export const PRICE_TIERS: PriceTier[] = [
  {
    name: "Бесплатно",
    price: "0 ₸",
    period: "один пробник в месяц",
    perks: ["Полный вариант: 120 вопросов", "AI-разбор ошибок этого пробника"],
  },
  {
    name: "До ЕНТ-2027",
    price: "14 990 ₸",
    period: "до 1 сентября 2027 года",
    perks: ["Пробники без ограничений", "AI-разбор каждой ошибки", "Конспекты по всем темам"],
    note: "Тем, кто в списке, — скидка на старте",
    featured: true,
  },
];

export const FAQ = [
  {
    question: "Когда запуск?",
    answer: "В октябре 2026 года. Всем, кто в списке, напишем в день запуска.",
  },
  {
    question: "Есть ли на казахском?",
    answer: "Да. Сдавать можно на казахском или на русском — вопросы и разбор будут на выбранном языке.",
  },
  {
    question: "Это настоящие задания ЕНТ?",
    answer:
      "Да. В основе — задания из сборников ЕНТ 2015–2026 годов. Новые вопросы пишут учителя, которые много лет готовят к ЕНТ, — строго по формату экзамена.",
  },
  {
    question: "Что если не понравится?",
    answer: "Вернём деньги. Напишите нам в Telegram — и всё.",
  },
  {
    question: "Запись к чему-то обязывает?",
    answer: "Нет. Запись бесплатная: мы только сообщим о запуске и дадим скидку. Платить или нет — решите сами.",
  },
  {
    question: "Чем это лучше бесплатных тестов?",
    answer:
      "Бесплатные тесты показывают только балл. Здесь после пробника видно, почему ответ неверный и как решать правильно, — по каждой вашей ошибке.",
  },
];

export const CONTACTS = [
  { label: "Telegram", href: "https://t.me/saba1aq" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nurym-zhanserik/" },
];
