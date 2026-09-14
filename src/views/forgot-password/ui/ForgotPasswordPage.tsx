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
import { isPhoneComplete, phoneToE164 } from "@/shared/lib/phone";
import { Button, FormError, NarrowFormLayout, PasswordField, PhoneField, SectionLabel } from "@/shared/ui";

type Step = { name: "phone" } | { name: "code"; request: CodeRequestResult } | { name: "password"; token: string };

const STEP_NUMBERS: Record<Step["name"], number> = { phone: 1, code: 2, password: 3 };

const STEP_SUBTITLES: Record<Step["name"], string | null> = {
  phone: "Укажите номер телефона, привязанный к аккаунту. Мы отправим SMS с кодом для восстановления доступа.",
  code: null,
  password: "Номер подтверждён. Задайте новый пароль — после этого вы сразу войдёте.",
};

export function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>({ name: "phone" });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isPhoneComplete(phone)) {
      setError("Введите номер полностью — 10 цифр после +7.");
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      setStep({ name: "code", request: await requestPhoneCode(phoneToE164(phone), "password_reset", UI_LANGUAGE) });
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
      await resetPasswordAndSignIn(phoneToE164(phone), step.token, password);
      router.replace(routes.examSetup);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось сменить пароль.");
      setIsBusy(false);
    }
  };

  const footer = (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-medium text-ink-soft">Не приходит SMS?</p>
      <p className="text-xs/[19px] text-ink-faint">
        Проверьте, что номер указан верно, или напишите в поддержку — ответим в течение 15 минут.
      </p>
    </div>
  );

  const subtitle = STEP_SUBTITLES[step.name];

  return (
    <NarrowFormLayout footer={footer}>
      <div className="flex flex-col gap-3">
        <Link
          href={routes.signIn}
          className="press -mx-2 -mt-1.5 inline-flex w-fit items-center gap-[7px] rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink"
        >
          <ArrowLeft className="size-[15px]" aria-hidden />
          Ко входу
        </Link>

        <div className="flex flex-col gap-2">
          <SectionLabel>Шаг {STEP_NUMBERS[step.name]} из 3</SectionLabel>
          <h1 className="font-display text-[30px]/[1.1] font-medium tracking-[-0.8px] text-ink">Забыли пароль?</h1>
          {subtitle ? <p className="text-sm/[22px] text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>

      {step.name === "phone" ? (
        <form onSubmit={requestCode} className="flex flex-col gap-5">
          <PhoneField
            label="Номер телефона"
            value={phone}
            onChange={setPhone}
            hint="Код действует 5 минут. Отправка бесплатна."
            required
          />
          <FormError message={error} />
          <Button type="submit" size="lg" loading={isBusy} className="w-full">
            Отправить код
          </Button>
        </form>
      ) : null}

      {step.name === "code" ? (
        <PhoneCodeStep
          phone={phoneToE164(phone)}
          purpose="password_reset"
          request={step.request}
          onVerified={(token) => setStep({ name: "password", token })}
          onChangePhone={() => setStep({ name: "phone" })}
        />
      ) : null}

      {step.name === "password" ? (
        <form onSubmit={complete} className="flex flex-col gap-5">
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
          <Button type="submit" size="lg" loading={isBusy} disabled={password.length < 8} className="w-full">
            Сменить пароль
          </Button>
        </form>
      ) : null}
    </NarrowFormLayout>
  );
}
