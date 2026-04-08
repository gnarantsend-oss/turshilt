import "./globals.css";

export const metadata = {
  title: "Nabo Stream",
  description: "2026 Next.js Streaming Site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}