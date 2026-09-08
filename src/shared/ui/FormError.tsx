type FormErrorProps = {
  message: string | null;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="rounded-md bg-sunken px-3.5 py-3 text-[13px] text-ink-soft">
      {message}
    </p>
  );
}
