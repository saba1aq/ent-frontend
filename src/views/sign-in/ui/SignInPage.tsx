"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { signIn, useSessionStatus } from "@/entities/session";
import { ApiError } from "@/shared/api";
import { routes, withNext } from "@/shared/config/routes";
import { Button, Checkbox, FormError, NarrowFormLayout, PasswordField, TextField } from "@/shared/ui";

type SignInPageProps = {
  next: string;
};

export function SignInPage({ next }: SignInPageProps) {
  const router = useRouter();
  const status = useSessionStatus();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !isSubmitting) {
      router.replace(next);
    }
  }, [status, isSubmitting, next, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(phone, password, remember);
      router.replace(next);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось войти. Попробуйте ещё раз.");
      setIsSubmitting(false);
    }
  };

  return (
    <NarrowFormLayout>
      <h1 className="font-serif text-[38px] font-medium tracking-[-0.9px] text-ink">Вход в кабинет</h1>

      <form onSubmit={submit} className="flex flex-col gap-[22px]">
        <TextField
          label="Номер телефона"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 701 234 56 78"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <PasswordField
          label="Пароль"
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <div className="flex items-center justify-between gap-4">
          <Checkbox label="Запомнить меня" checked={remember} onChange={setRemember} />
          <Link href={routes.forgotPassword} className="text-[13px] font-medium text-ink-soft hover:underline">
            Забыли пароль?
          </Link>
        </div>

        <FormError message={error} />

        <Button type="submit" disabled={isSubmitting} className="w-full py-3.5">
          Войти
        </Button>
      </form>

      <div className="flex items-center gap-3.5 py-1">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] tracking-[1.4px] text-ink-faint">ИЛИ</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Link
        href={withNext(routes.signUp, next)}
        className="inline-flex w-full items-center justify-center rounded-md bg-surface px-5 py-3 text-sm font-medium text-ink outline outline-line-strong transition-colors hover:bg-canvas"
      >
        Зарегистрироваться по номеру
      </Link>
    </NarrowFormLayout>
  );
}
