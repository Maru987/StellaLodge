import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Stella Lodge Tahiti - Un paradis tropical en Polynésie française",
  description: "Découvrez notre lodge de luxe au cœur de Tahiti. Profitez d'un séjour inoubliable dans un cadre idyllique avec vue sur le lagon turquoise.",
  keywords: "Tahiti, lodge, hébergement, Polynésie française, vacances, luxe, tropical",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
