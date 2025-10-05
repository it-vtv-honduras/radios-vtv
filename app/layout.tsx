// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "next-themes";
import AdSenseTest from "./AdSenseTest"
import { AdBanner } from "@/components/ad-banner";
const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = "https://www.radiosgrupovtv.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Radios Grupo VTV", template: "%s | Radios Grupo VTV" },
  description:
    "Escucha radios en vivo por internet: Picosa, Joya FM, La Pegajosa, Acción Radio, Mía FM y más.",
  keywords: [
    "picosa radio",
    "joya fm",
    "radio hit",
    "la pegajosa",
    "acción radio",
    "mia fm",
    "radio en vivo",
    "emisoras online",
    "radios de Honduras",
    "escuchar radio online",
    "vtv honduras",
    "vtv",
  ],
  alternates: { canonical: "/", languages: { "es-HN": "/", es: "/" } },
  openGraph: {
    type: "website",
    siteName: "Radios Grupo VTV",
    url: siteUrl,
    title: "Escuchar radios en vivo",
    description:
      "Escucha Picosa Radio, Joya FM, La Pegajosa, Acción Radio y Mía FM online 24/7.",
    images: [
      {
        url: "/og/radios-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Radios Grupo VTV - radios online",
      },
    ],
    locale: "es_HN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radios Grupo VTV",
    description:
      "Escucha emisoras online en vivo: Picosa, Joya FM, Radio Hit, Acción Radio, Mía FM y más.",
    images: ["/og/radios-1200x630.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* JSON-LD: Organization (global) */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Radios Grupo VTV",
            url: siteUrl,
          })}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4210489377880865"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Ayuda a indicar esquema de color al navegador */}
        <meta name="color-scheme" content="light dark" />
        <meta name="google-adsense-account" content="ca-pub-4210489377880865"></meta>
      </head>
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        {/* ÚNICO ThemeProvider en toda la app */}
        <ThemeProvider
          attribute="class" // agrega 'dark'/'light' a <html>
          defaultTheme="dark" // respeta el sistema en el primer paint
          enableSystem
          disableTransitionOnChange // evita parpadeos de transición
        >
          <AdBanner adSlot="1234567890" className="my-6" />
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
