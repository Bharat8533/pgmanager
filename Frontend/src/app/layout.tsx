import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PGMaster – Smarter PG & Hostel Management Cloud",
  description:
    "Cloud-based PG and co-living management SaaS. Effortlessly manage multiple properties, rooms, beds, resident records, and rent collection anywhere.",
  keywords: [
    "PGMaster",
    "PG management software",
    "Paying Guest software",
    "Hostel management",
    "Co-living management",
    "Rent collection software",
    "Room and bed management",
    "SaaS",
  ],
  authors: [{ name: "PGMaster" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-brand-offwhite text-brand-charcoal antialiased selection:bg-brand-lime selection:text-brand-charcoal">
        {children}
      </body>
    </html>
  );
}
