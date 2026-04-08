import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NABO — Монголын Стриминг",
  description: "Монголын хамгийн шилдэг кино, цуврал, шоу — нэг дороос.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
