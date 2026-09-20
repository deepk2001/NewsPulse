import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import EmotionRegistry from "./emotion-registry";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "News Pulse",
  description: "Daily theme digests of today’s news",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <EmotionRegistry>{children}</EmotionRegistry>
      </body>
    </html>
  );
}
