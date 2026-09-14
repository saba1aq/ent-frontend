const NATIONAL_LENGTH = 10;

export function phoneDigits(value: string): string {
  const hasPrefix = value.startsWith("+7");
  const digits = (hasPrefix ? value.slice(2) : value).replace(/\D/g, "");
  if (hasPrefix) {
    return digits.slice(0, NATIONAL_LENGTH);
  }
  if (digits.startsWith("8") || (digits.length > NATIONAL_LENGTH && digits.startsWith("7"))) {
    return digits.slice(1, NATIONAL_LENGTH + 1);
  }
  return digits.slice(0, NATIONAL_LENGTH);
}

export function formatPhone(digits: string): string {
  const area = digits.slice(0, 3);
  const head = digits.slice(3, 6);
  const middle = digits.slice(6, 8);
  const tail = digits.slice(8, 10);

  let formatted = "+7";
  if (area) {
    formatted += ` (${area}`;
  }
  if (area.length === 3) {
    formatted += ")";
  }
  if (head) {
    formatted += ` ${head}`;
  }
  if (middle) {
    formatted += ` ${middle}`;
  }
  if (tail) {
    formatted += ` ${tail}`;
  }
  return formatted;
}

export function phoneToE164(digits: string): string {
  return `+7${digits}`;
}

export function isPhoneComplete(digits: string): boolean {
  return digits.length === NATIONAL_LENGTH;
}

function countryDigitsDropped(value: string): number {
  if (value.startsWith("+7")) {
    return 1;
  }
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("8") || (digits.length > NATIONAL_LENGTH && digits.startsWith("7")) ? 1 : 0;
}

export function nationalDigitsBefore(value: string, caret: number): number {
  const headDigits = value.slice(0, caret).replace(/\D/g, "").length;
  return Math.max(headDigits - countryDigitsDropped(value), 0);
}

export function caretAfterDigit(formatted: string, digitIndex: number): number {
  if (digitIndex <= 0) {
    return Math.min(2, formatted.length);
  }
  let seen = 0;
  for (let index = 2; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index])) {
      seen += 1;
      if (seen === digitIndex) {
        let caret = index + 1;
        while (caret < formatted.length && !/\d/.test(formatted[caret])) {
          caret += 1;
        }
        return caret;
      }
    }
  }
  return formatted.length;
}
