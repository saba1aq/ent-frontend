import { LANGUAGE_NATIVE_NAMES, LANGUAGES, type Language } from "@/shared/config/language";
import { SectionLabel, Segmented } from "@/shared/ui";

const LANGUAGE_OPTIONS = LANGUAGES.map((language) => ({
  value: language,
  label: LANGUAGE_NATIVE_NAMES[language],
}));

type LanguageSwitchProps = {
  value: Language;
  label: string;
  onChange: (language: Language) => void;
};

export function LanguageSwitch({ value, label, onChange }: LanguageSwitchProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <SectionLabel as="span" tone="soft">{label}</SectionLabel>
      <Segmented value={value} options={LANGUAGE_OPTIONS} onChange={onChange} ariaLabel={label} />
    </div>
  );
}
