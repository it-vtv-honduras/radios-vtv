// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const siteUrl = "https://www.radiosgrupovtv.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Radios Grupo VTV", template: "%s | Radios Grupo VTV" },
  description:
    "Escucha radios en vivo por internet: Picosa, Joya FM, La Pegajosa, Acción Radio, Mía FM y más.",
  alternates: { canonical: "/", languages: { "es-HN": "/", es: "/" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Radios Grupo VTV",
            url: siteUrl,
          })}
        </Script>

        <Script
          id="adsense-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4210489377880865"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-4210489377880865" />
        <meta name="color-scheme" content="light dark" />
      </head>

      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
