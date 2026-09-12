import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Шаблоны ЕГЭ по информатике",
  description: "Короткие разборы и готовые шаблоны к заданиям ЕГЭ по информатике.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
