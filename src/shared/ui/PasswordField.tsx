"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { TextField } from "./TextField";

type PasswordFieldProps = Omit<React.ComponentProps<typeof TextField>, "type" | "suffix">;

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={isVisible ? "text" : "password"}
      suffix={
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
          className="cursor-pointer text-ink-faint transition-colors hover:text-ink-soft"
        >
          {isVisible ? <EyeOff className="size-[17px]" aria-hidden /> : <Eye className="size-[17px]" aria-hidden />}
        </button>
      }
    />
  );
}
