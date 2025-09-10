// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Dominio público (configúralo en Netlify → NEXT_PUBLIC_SITE_URL)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stream-radios.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Central de Radios",
    template: "%s | Central de Radios",
  },
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
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-HN": "/",
      es: "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Central de Radios",
    url: siteUrl,
    title: "Escuchar radios en vivo",
    description:
      "Escucha Picosa Radio, Joya FM, Radio Hit (La Pegajosa), Acción Radio y Mía FM online 24/7.",
    images: [
      {
        url: "/og/radios-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Central de Radios - radios online",
      },
    ],
    locale: "es_HN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Central de Radios",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* JSON-LD: Organization (global) */}
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Central de Radios",
            url: siteUrl,
            logo: `${siteUrl}/icon-512.png`,
          })}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
