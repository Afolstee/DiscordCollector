import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Discord - Cryptocurrency Tracker",
  description:
    "Track your favorite cryptocurrencies with real-time data and portfolio management",
  keywords: [
    "cryptocurrency",
    "crypto",
    "tracker",
    "portfolio",
    "bitcoin",
    "ethereum",
  ],
  authors: [{ name: "Crypto Discord Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
