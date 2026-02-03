import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BeautyBeauté - Médecine Esthétique en France",
    template: "%s | BeautyBeauté",
  },
  description:
    "Trouvez les meilleurs centres de médecine esthétique près de chez vous. Épilation laser, cryolipolyse, hydrafacial et injections.",
  keywords: [
    "médecine esthétique",
    "épilation laser",
    "cryolipolyse",
    "hydrafacial",
    "botox",
    "France",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

