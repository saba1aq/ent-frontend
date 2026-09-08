type FormErrorProps = {
  message: string | null;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }
  return (
    <p
      role="alert"
      data-motion
      className="animate-enter rounded-md bg-wrong-soft px-3.5 py-3 text-[13px] text-wrong ring-1 ring-wrong/12"
    >
      {message}
    </p>
  );
}
