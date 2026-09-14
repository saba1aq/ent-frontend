"use client";

import { useLayoutEffect, useRef } from "react";

import { caretAfterDigit, formatPhone, nationalDigitsBefore, phoneDigits } from "@/shared/lib/phone";

import { TextField } from "./TextField";

type PhoneFieldProps = Omit<React.ComponentProps<typeof TextField>, "value" | "onChange" | "type" | "inputMode"> & {
  value: string;
  onChange: (digits: string) => void;
};

export function PhoneField({ value, onChange, ...rest }: PhoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const formatted = value ? formatPhone(value) : "";

  useLayoutEffect(() => {
    const caret = caretRef.current;
    caretRef.current = null;
    if (caret !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret, caret);
    }
  });

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const caret = event.target.selectionStart ?? raw.length;
    const typedBefore = nationalDigitsBefore(raw, caret);

    let digits = phoneDigits(raw);
    let digitIndex = typedBefore;

    if (raw.length < formatted.length && digits.length === value.length && typedBefore > 0) {
      digits = digits.slice(0, typedBefore - 1) + digits.slice(typedBefore);
      digitIndex = typedBefore - 1;
    }

    caretRef.current = digits ? caretAfterDigit(formatPhone(digits), Math.min(digitIndex, digits.length)) : 0;
    onChange(digits);
  };

  return (
    <TextField
      placeholder="+7 (777) 123 45 67"
      {...rest}
      ref={inputRef}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={formatted}
      onChange={change}
    />
  );
}
