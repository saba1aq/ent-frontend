"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";

import { isPairAllowed, SubjectIcon } from "@/entities/subject";
import { describeError } from "@/shared/api";
import { DEFAULT_TEST_LANGUAGE, type Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";
import { Button, Checkbox, FormError, PhoneField, Segmented, Surface, TextField } from "@/shared/ui";

import { joinWaitlist, type ContactKind } from "../api/waitlist-api";
import { PROFILE_PAIRS, PROFILE_SUBJECTS, UNDECIDED_LABEL } from "../model/profile-subjects";
import { toRequest, validateDraft, type WaitlistDraft } from "../model/waitlist-form";
import { SectionHeading } from "./SectionHeading";

const CONTACT_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "phone", label: "Телефон" },
] as const satisfies readonly { value: ContactKind; label: string }[];

const LANGUAGE_OPTIONS = [
  { value: "kk", label: "Қазақша" },
  { value: "ru", label: "Русский" },
] as const satisfies readonly { value: Language; label: string }[];

const INITIAL_DRAFT: WaitlistDraft = {
  name: "",
  contactKind: "telegram",
  telegram: "",
  phone: "",
  language: DEFAULT_TEST_LANGUAGE,
  subjects: [],
  undecided: false,
  consent: false,
};

type ChipProps = {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Chip({ pressed, disabled, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "press inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[14px] ring-1 transition-[background-color,color,box-shadow,opacity] duration-150 ease-out",
        pressed
          ? "bg-accent font-semibold text-white ring-accent"
          : "bg-surface text-ink-soft ring-line-strong hover:bg-sunken",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-[13px] font-medium text-ink-soft">{label}</legend>
      {children}
      {error ? <p className="text-xs text-wrong">{error}</p> : null}
    </fieldset>
  );
}

function SuccessState({ name }: { name: string }) {
  return (
    <div className="animate-enter flex flex-col items-start gap-4 py-6">
      <span className="flex size-11 items-center justify-center rounded-full bg-correct-soft text-correct">
        <CircleCheck className="size-6" aria-hidden />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[24px]/[1.2] font-medium tracking-[-0.4px] text-ink">
          {name}, вы в списке
        </h3>
        <p className="max-w-[440px] text-[15px]/[24px] text-ink-muted">
          Напишем в день запуска — в октябре 2026 года. Скидка для списка будет ждать вас там же.
        </p>
      </div>
    </div>
  );
}

export function WaitlistForm() {
  const [draft, setDraft] = useState<WaitlistDraft>(INITIAL_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [joinedName, setJoinedName] = useState<string | null>(null);

  const errors = submitted ? validateDraft(draft) : {};

  const update = (patch: Partial<WaitlistDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const toggleSubject = (code: string) => {
    const subjects = draft.subjects.includes(code)
      ? draft.subjects.filter((selected) => selected !== code)
      : [...draft.subjects, code];
    update({ subjects });
  };

  const isSubjectDisabled = (code: string) => {
    if (draft.subjects.includes(code)) {
      return false;
    }
    if (draft.undecided) {
      return true;
    }
    if (draft.subjects.length >= 2) {
      return true;
    }
    return draft.subjects.length === 1 && !isPairAllowed(PROFILE_PAIRS, draft.subjects[0], code);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.keys(validateDraft(draft)).length > 0) {
      return;
    }
    setPending(true);
    try {
      await joinWaitlist(toRequest(draft));
      setJoinedName(draft.name.trim());
    } catch (caught) {
      setServerError(describeError(caught, "Не получилось записать. Попробуйте ещё раз или напишите нам в Telegram."));
    } finally {
      setPending(false);
    }
  };

  return (
    <section id="waitlist" className="grid scroll-mt-6 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-12">
      <SectionHeading
        label="Лист ожидания"
        title="Запишитесь — сообщим о запуске"
        text="Запуск в октябре 2026 года. Тем, кто в списке, — скидка на подписку и первыми доступ к пробникам."
      />

      <Surface className="p-5 sm:p-7">
        {joinedName ? (
          <SuccessState name={joinedName} />
        ) : (
          <form noValidate onSubmit={submit} className="flex flex-col gap-6">
            <TextField
              label="Имя"
              name="name"
              autoComplete="given-name"
              placeholder="Как к вам обращаться"
              value={draft.name}
              onChange={(event) => update({ name: event.target.value })}
              error={errors.name}
            />

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-ink-soft">Куда написать о запуске</span>
                <Segmented
                  value={draft.contactKind}
                  options={CONTACT_OPTIONS}
                  onChange={(contactKind) => update({ contactKind })}
                  ariaLabel="Способ связи"
                />
              </div>
              {draft.contactKind === "telegram" ? (
                <TextField
                  label="Ник в Telegram"
                  name="telegram"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="@username"
                  value={draft.telegram}
                  onChange={(event) => update({ telegram: event.target.value })}
                  error={errors.contact}
                />
              ) : (
                <PhoneField
                  label="Номер телефона"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+7 (700) 000 00 00"
                  value={draft.phone}
                  onChange={(phone) => update({ phone })}
                  error={errors.contact}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-ink-soft">Язык сдачи</span>
              <Segmented
                value={draft.language}
                options={LANGUAGE_OPTIONS}
                onChange={(language) => update({ language })}
                ariaLabel="Язык сдачи"
              />
            </div>

            <FieldGroup label="Профильные предметы" error={errors.subjects}>
              <div className="flex flex-wrap gap-2">
                {PROFILE_SUBJECTS.map((subject) => (
                  <Chip
                    key={subject.code}
                    pressed={draft.subjects.includes(subject.code)}
                    disabled={isSubjectDisabled(subject.code)}
                    onClick={() => toggleSubject(subject.code)}
                  >
                    <SubjectIcon name={subject.icon} className="size-4" aria-hidden />
                    {subject.name}
                  </Chip>
                ))}
                <Chip
                  pressed={draft.undecided}
                  disabled={draft.subjects.length > 0}
                  onClick={() => update({ undecided: !draft.undecided })}
                >
                  {UNDECIDED_LABEL}
                </Chip>
              </div>
            </FieldGroup>

            <div className="flex flex-col gap-2">
              <Checkbox
                label="Соглашаюсь на обработку персональных данных, чтобы вы сообщили мне о запуске"
                checked={draft.consent}
                onChange={(consent) => update({ consent })}
                className="items-start [&>span]:mt-px [&>span]:shrink-0"
              />
              {errors.consent ? <p className="text-xs text-wrong">{errors.consent}</p> : null}
            </div>

            <FormError message={serverError} />

            <Button type="submit" size="lg" loading={pending} className="w-full">
              Записаться на запуск
            </Button>
          </form>
        )}
      </Surface>
    </section>
  );
}
