import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('staymanage_theme_preference');
                  var isDark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-offwhite text-brand-charcoal antialiased selection:bg-brand-lime selection:text-brand-charcoal">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
