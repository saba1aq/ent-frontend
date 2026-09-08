"use client";

import { useState } from "react";

import { type CodeRequestResult, requestPhoneCode, verifyPhoneCode, type VerificationPurpose } from "@/entities/session";
import { ApiError } from "@/shared/api";
import { UI_LANGUAGE } from "@/shared/config/language";
import { Button, FormError, TextField } from "@/shared/ui";

import { useCountdown } from "../model/use-countdown";

type PhoneCodeStepProps = {
  phone: string;
  purpose: VerificationPurpose;
  request: CodeRequestResult;
  onVerified: (verificationToken: string) => void;
  onChangePhone: () => void;
};

export function PhoneCodeStep({ phone, purpose, request, onVerified, onChangePhone }: PhoneCodeStepProps) {
  const [current, setCurrent] = useState(request);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const resendIn = useCountdown(current.resendAfter, current);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsBusy(true);
    try {
      const result = await verifyPhoneCode(phone, code.trim(), purpose);
      onVerified(result.verificationToken);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось проверить код.");
    } finally {
      setIsBusy(false);
    }
  };

  const resend = async () => {
    setError(null);
    setIsBusy(true);
    try {
      setCurrent(await requestPhoneCode(phone, purpose, UI_LANGUAGE));
      setCode("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Не удалось отправить код.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-[18px]">
      <p className="text-sm/[22px] text-ink-muted">
        Код отправлен на <span className="font-medium text-ink">{current.phone}</span>.{" "}
        <button type="button" onClick={onChangePhone} className="cursor-pointer font-medium text-ink-soft underline-offset-2 hover:underline">
          Изменить номер
        </button>
      </p>

      <TextField
        label="Код из SMS"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
        hint={current.debugCode ? `Код для разработки: ${current.debugCode}` : "Код действует 5 минут."}
        required
      />

      <FormError message={error} />

      <Button type="submit" disabled={isBusy || code.length < 4} className="w-full py-3.5">
        Подтвердить
      </Button>

      <div className="text-center text-[13px] text-ink-faint">
        {resendIn > 0 ? (
          <span>Отправить код повторно через {resendIn} с</span>
        ) : (
          <button type="button" onClick={resend} disabled={isBusy} className="cursor-pointer font-medium text-ink-soft hover:underline">
            Отправить код повторно
          </button>
        )}
      </div>
    </form>
  );
}
