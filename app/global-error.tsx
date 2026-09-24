"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

const INK = "#0C2E44";
const ACCENT = "#FF5F00";

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1.25rem",
          backgroundColor: "#FFFFFF",
          color: INK,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <title>Сбой — upstudy</title>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "28rem" }}>
          <svg viewBox="0 0 32 32" fill="none" width="40" height="40" aria-hidden>
            <path d="M8 14v4a6 6 0 0 0 12 0v-4" stroke={INK} strokeWidth="4" strokeLinecap="round" />
            <path d="M20 15V10" stroke={ACCENT} strokeWidth="4" />
            <path d="M20 5 25 11H15z" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", lineHeight: 1.2, letterSpacing: "-0.6px" }}>
              Приложение не запустилось
            </h1>
            <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.6, color: "#4A6B80" }}>
              Это редкий сбой на нашей стороне. Перезагрузите страницу — если не поможет, зайдите чуть позже.
            </p>
          </div>

          <button
            type="button"
            onClick={() => retry()}
            style={{
              appearance: "none",
              border: "none",
              borderRadius: "10px",
              padding: "0.8rem 1.25rem",
              backgroundColor: ACCENT,
              color: "#FFFFFF",
              fontSize: "0.9375rem",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Перезагрузить
          </button>

          {error.digest ? (
            <p style={{ margin: 0, fontSize: "0.6875rem", color: "#8AA2B2" }}>Код ошибки: {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
