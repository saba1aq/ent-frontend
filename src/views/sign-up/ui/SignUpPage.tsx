"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { type CodeRequestResult, requestPhoneCode, signUp } from "@/entities/session";
import { PhoneCodeStep } from "@/features/phone-verification";
import { ApiError } from "@/shared/api";
import { UI_LANGUAGE } from "@/shared/config/language";
import { routes, withNext } from "@/shared/config/routes";
import { isPhoneComplete, phoneToE164 } from "@/shared/lib/phone";
import { clearReferralCode, readReferralCode } from "@/shared/lib/referral";
import { Button, FormError, NarrowFormLayout, PasswordField, PhoneField, SectionLabel, TextField } from "@/shared/ui";

type SignUpPageProps = {
  next: string;
};

type Step = { name: "phone" } | { name: "code"; request: CodeRequestResult } | { name: "password"; token: string };

const STEP_NUMBERS: Record<Step["name"], number> = { phone: 1, code: 2, password: 3 };

const STEP_SUBTITLES: Record<Step["name"], string | null> = {
  phone: "Укажите номер телефона — отправим SMS с кодом подтверждения.",
  code: null,
  password: "Номер подтверждён. Осталось представиться и придумать пароль.",
};

export function SignUpPage({ next }: SignUpPageProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>({ name: "phone" });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      setStep({ name: "code", request: await requestPhoneCode(phoneToE164(phone), "registration", UI_LANGUAGE) });
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
      await signUp({
        phone: phoneToE164(phone),
        password,
        verificationToken: step.token,
        language: UI_LANGUAGE,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        referralCode: readReferralCode(),
      });
      clearReferralCode();
      router.replace(next);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось завершить регистрацию.");
      setIsBusy(false);
    }
  };

  const subtitle = STEP_SUBTITLES[step.name];

  return (
    <NarrowFormLayout>
      <div className="flex flex-col gap-3">
        <Link
          href={withNext(routes.signIn, next)}
          className="press -mx-2 -mt-1.5 inline-flex w-fit items-center gap-[7px] rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-muted transition-colors duration-150 ease-out hover:bg-sunken hover:text-ink"
        >
          <ArrowLeft className="size-[15px]" aria-hidden />
          Ко входу
        </Link>

        <div className="flex flex-col gap-2">
          <SectionLabel>Шаг {STEP_NUMBERS[step.name]} из 3</SectionLabel>
          <h1 className="font-display text-[30px]/[1.1] font-medium tracking-[-0.8px] text-ink">Регистрация</h1>
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
          purpose="registration"
          request={step.request}
          onVerified={(token) => setStep({ name: "password", token })}
          onChangePhone={() => setStep({ name: "phone" })}
        />
      ) : null}

      {step.name === "password" ? (
        <form onSubmit={complete} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <TextField
              label="Имя"
              autoComplete="given-name"
              placeholder="Жадыра"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              maxLength={40}
              className="min-w-0 flex-1"
              required
            />
            <TextField
              label="Фамилия"
              autoComplete="family-name"
              placeholder="Нурымовна"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              maxLength={40}
              className="min-w-0 flex-1"
              required
            />
          </div>
          <p className="-mt-3 text-xs text-ink-faint">Имя и фамилию увидят другие ученики в рейтинге.</p>
          <PasswordField
            label="Пароль"
            autoComplete="new-password"
            placeholder="Минимум 8 символов"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Не короче 8 символов, не только цифры."
            required
          />
          <FormError message={error} />
          <Button type="submit" size="lg" loading={isBusy} disabled={password.length < 8 || firstName.trim().length < 2 || lastName.trim().length < 2} className="w-full">
            Создать аккаунт
          </Button>
        </form>
      ) : null}
    </NarrowFormLayout>
  );
}
