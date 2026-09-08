import { Check } from "lucide-react";

import { LANGUAGE_NATIVE_NAMES, LANGUAGES, type Language } from "@/shared/config/language";
import { cn } from "@/shared/lib/cn";

type LanguageSwitchProps = {
  value: Language;
  label: string;
  onChange: (language: Language) => void;
};

export function LanguageSwitch({ value, label, onChange }: LanguageSwitchProps) {
  return (
    <div role="group" aria-label={label} className="flex w-fit gap-1 rounded-md bg-canvas p-1 outline outline-line">
      {LANGUAGES.map((language) => {
        const isActive = language === value;

        return (
          <button
            key={language}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(language)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm transition-colors",
              isActive
                ? "font-medium text-ink-soft shadow-sm outline-[1.5px] outline-ink-soft"
                : "text-ink-muted outline outline-line-strong hover:text-ink-soft",
            )}
          >
            {isActive ? <Check className="size-3.5" aria-hidden /> : null}
            {LANGUAGE_NATIVE_NAMES[language]}
          </button>
        );
      })}
    </div>
  );
}
