import type { Quote } from "@/entities/subscription";
import { Button, FormError, TextField } from "@/shared/ui";

type PromoFieldProps = {
  value: string;
  quote: Quote | null;
  error: string | null;
  isChecking: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
};

export function PromoField({ value, quote, error, isChecking, onChange, onApply }: PromoFieldProps) {
  return (
    <form
      className="flex flex-col gap-2.5"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <div className="flex items-end gap-2.5">
        <TextField
          label="Промокод"
          value={value}
          placeholder="UPSTUDY"
          autoComplete="off"
          className="flex-1"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
        />
        <Button type="submit" variant="secondary" size="lg" loading={isChecking} disabled={value.trim().length === 0}>
          Применить
        </Button>
      </div>
      <FormError message={error} />
      {quote && !error ? (
        <p className="text-[13px] text-correct">Промокод {quote.promoCode} применён — цены обновлены выше.</p>
      ) : null}
    </form>
  );
}
