import { cn } from "@/shared/lib/cn";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedProps<T extends string> = {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

export function Segmented<T extends string>({ value, options, onChange, ariaLabel, className }: SegmentedProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("relative inline-grid w-fit auto-cols-fr grid-flow-col rounded-full bg-sunken p-1 ring-1 ring-line", className)}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-full bg-accent shadow-thumb transition-transform duration-200 ease-in-out"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex h-8 cursor-pointer items-center justify-center rounded-full px-4 text-[13px] transition-colors duration-150 ease-out",
              isActive ? "font-semibold text-white" : "text-ink-muted hover:text-ink-soft",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
