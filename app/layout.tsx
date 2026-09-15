import type { Metadata } from "next";
import { Geologica, Golos_Text } from "next/font/google";

import { ReferralCapture, ToastViewport } from "@/shared/ui";

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
  title: "upstudy — подготовка к ЕНТ",
  description: "upstudy: пробное ЕНТ с реальными заданиями и разбором каждой ошибки",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${golosText.variable} ${geologica.variable}`}>
      <body>
        {children}
        <ReferralCapture />
        <ToastViewport />
      </body>
    </html>
  );
}
