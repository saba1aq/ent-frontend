import { NotAuthenticatedError } from "./authorized-request";
import { ApiError } from "./http";

const CODE_MESSAGES: Record<string, string> = {
  attempt_expired: "Время экзамена вышло, попытка закрыта.",
  attempt_not_active: "Эта попытка уже завершена.",
  active_attempt_exists: "У вас уже есть начатый экзамен.",
  not_enough_questions: "В банке пока не хватает вопросов для такого варианта.",
  not_finished: "Разбор будет доступен после завершения экзамена.",
  verification_cooldown: "Код уже отправлен, запросите новый чуть позже.",
  verification_attempts_exceeded: "Слишком много попыток ввода кода, запросите новый.",
  invalid_code: "Неверный код из SMS.",
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "Проверьте данные и попробуйте ещё раз.",
  403: "Нет доступа к этим данным.",
  404: "Не нашли эти данные — возможно, ссылка устарела.",
  409: "Действие сейчас недоступно.",
  429: "Слишком много запросов, подождите немного.",
  500: "Сервер не отвечает. Попробуйте позже.",
  502: "Сервер не отвечает. Попробуйте позже.",
  503: "Сервер не отвечает. Попробуйте позже.",
};

export function describeError(caught: unknown, fallback = "Что-то пошло не так. Попробуйте ещё раз."): string {
  if (caught instanceof NotAuthenticatedError) {
    return "Сессия истекла, войдите заново.";
  }
  if (caught instanceof ApiError) {
    if (caught.code && CODE_MESSAGES[caught.code]) {
      return CODE_MESSAGES[caught.code];
    }
    return STATUS_MESSAGES[caught.status] ?? fallback;
  }
  if (caught instanceof TypeError) {
    return "Нет связи с сервером. Проверьте соединение.";
  }
  return fallback;
}
