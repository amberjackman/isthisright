import "../public/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LoL In-Game Analyzer",
  description: "Analyze current League of Legends games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
