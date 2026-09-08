import type { Metadata } from "next";
import { Geologica, Golos_Text } from "next/font/google";

import { ToastViewport } from "@/shared/ui";

import "./globals.css";

const golosText = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-golos-text",
  display: "swap",
});

const geologica = Geologica({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-geologica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Тренажёр ЕНТ",
  description: "Тренажёр ЕНТ: реальные задания и разбор ошибок",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${golosText.variable} ${geologica.variable}`}>
      <body>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
