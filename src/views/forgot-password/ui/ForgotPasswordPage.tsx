"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { type CodeRequestResult, requestPhoneCode, resetPasswordAndSignIn } from "@/entities/session";
import { PhoneCodeStep } from "@/features/phone-verification";
import { ApiError } from "@/shared/api";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes } from "@/shared/config/routes";
import { Button, FormError, NarrowFormLayout, PasswordField, TextField } from "@/shared/ui";

type Step = { name: "phone" } | { name: "code"; request: CodeRequestResult } | { name: "password"; token: string };

export function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>({ name: "phone" });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsBusy(true);
    try {
      setStep({ name: "code", request: await requestPhoneCode(phone, "password_reset", UI_LANGUAGE) });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось отправить код.");
    } finally {
      setIsBusy(false);
    }
  };

  const complete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step.name !== "password") {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      await resetPasswordAndSignIn(phone, step.token, password);
      router.replace(routes.examSetup);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось сменить пароль.");
      setIsBusy(false);
    }
  };

  const footer = (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-medium text-ink">Не приходит SMS?</p>
      <p className="text-xs/[19px] text-ink-faint">
        Проверьте, что номер указан верно, или напишите в поддержку — ответим в течение 15 минут.
      </p>
    </div>
  );

  return (
    <NarrowFormLayout footer={footer}>
      <Link href={routes.signIn} className="flex items-center gap-[7px] text-[13px] font-medium text-ink-muted hover:text-ink-soft">
        <ArrowLeft className="size-[15px]" aria-hidden />
        Ко входу
      </Link>

      <h1 className="font-serif text-[38px] font-medium tracking-[-0.9px] text-ink">Забыли пароль?</h1>

      {step.name === "phone" ? (
        <form onSubmit={requestCode} className="flex flex-col gap-[18px]">
          <p className="text-sm/[22px] text-ink-muted">
            Укажите номер телефона, привязанный к аккаунту. Мы отправим SMS с кодом для восстановления доступа.
          </p>
          <TextField
            label="Номер телефона"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 701 234 56 78"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            hint="Код действует 5 минут. Отправка бесплатна."
            required
          />
          <FormError message={error} />
          <Button type="submit" disabled={isBusy} className="w-full py-3.5">
            Отправить код
          </Button>
        </form>
      ) : null}

      {step.name === "code" ? (
        <PhoneCodeStep
          phone={phone}
          purpose="password_reset"
          request={step.request}
          onVerified={(token) => setStep({ name: "password", token })}
          onChangePhone={() => setStep({ name: "phone" })}
        />
      ) : null}

      {step.name === "password" ? (
        <form onSubmit={complete} className="flex flex-col gap-[18px]">
          <p className="text-sm/[22px] text-ink-muted">Номер подтверждён. Задайте новый пароль — после этого вы сразу войдёте.</p>
          <PasswordField
            label="Новый пароль"
            autoComplete="new-password"
            placeholder="Минимум 8 символов"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Не короче 8 символов, не только цифры."
            required
          />
          <FormError message={error} />
          <Button type="submit" disabled={isBusy || password.length < 8} className="w-full py-3.5">
            Сменить пароль
          </Button>
        </form>
      ) : null}
    </NarrowFormLayout>
  );
}
