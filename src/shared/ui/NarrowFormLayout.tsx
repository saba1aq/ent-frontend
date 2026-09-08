type NarrowFormLayoutProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function NarrowFormLayout({ children, footer }: NarrowFormLayoutProps) {
  return (
    <main className="flex min-h-screen bg-surface">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-between gap-12 px-5 py-10 sm:py-12">
        <div className="flex flex-col gap-[22px]">{children}</div>
        {footer}
      </div>
    </main>
  );
}
