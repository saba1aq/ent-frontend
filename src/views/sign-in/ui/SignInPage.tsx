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

  const footer = (
    <p className="text-[13px] text-ink-muted">
      Нет аккаунта?{" "}
      <Link
        href={withNext(routes.signUp, next)}
        className="font-medium text-ink-soft underline-offset-2 transition-colors duration-150 ease-out hover:text-ink hover:underline"
      >
        Зарегистрироваться по номеру
      </Link>
    </p>
  );

  return (
    <NarrowFormLayout footer={footer}>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px]/[1.1] font-medium tracking-[-0.8px] text-ink">Вход в кабинет</h1>
        <p className="text-sm/[22px] text-ink-muted">Номер телефона и пароль — те же, что при регистрации.</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
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
          <Link
            href={routes.forgotPassword}
            className="press -mx-2 inline-flex items-center rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink"
          >
            Забыли пароль?
          </Link>
        </div>

        <FormError message={error} />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Войти
        </Button>
      </form>
    </NarrowFormLayout>
  );
}
