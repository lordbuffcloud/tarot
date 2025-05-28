import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DynamicBackground from "../components/DynamicBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Astral Oracle",
  description: "Tarot readings with a Ghibli witchy vibe",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/ui-elements/app-icon.png",
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
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} bg-transparent`}>
        <DynamicBackground />
        {children}
      </body>
    </html>
  );
}
