import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DynamicBackground from "../components/DynamicBackground";
import MagicParticles from "../components/MagicParticles";
import { ErrorBoundary } from "../components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Astral Oracle - AI-Powered Tarot Readings",
    template: "%s | Astral Oracle",
  },
  description: "Experience mystical tarot readings with AI-powered interpretations. Choose your spread, select your cards, and receive personalized insights with a beautiful Ghibli-inspired aesthetic.",
  keywords: ["tarot", "tarot reading", "AI tarot", "divination", "oracle", "spiritual guidance", "tarot cards"],
  authors: [{ name: "Astral Oracle" }],
  creator: "Astral Oracle",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/ui-elements/app-icon.png",
    apple: "/images/ui-elements/app-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astral-oracle.vercel.app",
    title: "Astral Oracle - AI-Powered Tarot Readings",
    description: "Experience mystical tarot readings with AI-powered interpretations.",
    siteName: "Astral Oracle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astral Oracle - AI-Powered Tarot Readings",
    description: "Experience mystical tarot readings with AI-powered interpretations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e1b4b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-transparent`}>
        <ErrorBoundary>
          <DynamicBackground />
          <MagicParticles />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
