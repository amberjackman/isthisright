import "../public/globals.css";

interface Metadata {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
}

export const metadata: Metadata = {
  title: "Am I Noisy?",
  description: "난 얼마나 시끄러울까?",
  ogTitle: "Am I Noisy?",
  ogDescription: "난 얼마나 시끄러울까? - 나의 핑 횟수를 확인하세요.",
  ogType: "website",
  twitterTitle: "Am I Noisy?",
  twitterDescription: "난 얼마나 시끄러울까? - 나의 핑 횟수를 확인하세요",
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
