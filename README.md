# ENT frontend

Next.js 16 / React 19 / Tailwind v4, архитектура Feature-Sliced Design (слой страниц — `src/views`).

```bash
pnpm install
cp .env.example .env.local        # NEXT_PUBLIC_API_URL, по умолчанию http://localhost:8000
pnpm dev                          # http://localhost:3000
pnpm lint && npx tsc --noEmit && pnpm build
```

Бэкенд должен быть поднят (`ent-backend`, `docker compose up`) — каталог предметов и все данные экзамена
идут оттуда.

## Маршруты

| Путь | Экран |
|---|---|
| `/` | лендинг |
| `/exam/setup` | выбор языка теста и двух профильных предметов (анонимно, выбор — в `sessionStorage`) |
| `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password` | вход, регистрация в три шага, сброс пароля через SMS-код |
| `/exam/[attemptId]` | экзамен: вопросы, автосохранение, отметки, таймер, завершение |
| `/exam/[attemptId]/results` | баллы по блокам и карта ответов |
| `/exam/[attemptId]/review/[questionId]` | разбор вопроса: верный ответ, ваш ответ, объяснение |
| `/exams` | все пробники пользователя: сводка и таблица, «Продолжить →» для идущего экзамена |

В dev-режиме бэкенд возвращает SMS-код в ответе (`OTP_DEBUG_EXPOSE_CODE=True`), и форма показывает его
подсказкой «Код для разработки» — настоящие SMS не нужны.
