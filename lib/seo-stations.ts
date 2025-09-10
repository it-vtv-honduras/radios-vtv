// lib/seo-stations.ts
import type { Metadata } from "next";
import type { Station } from "./types";

// Ajusta al dominio real
export const SITE_URL = "https://centralderadios.com";

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Palabras/alias por defecto por estación
export function stationSynonyms(station: Station): string[] {
  const base = [
    station.name,
    `${station.name} en vivo`,
    `escuchar ${station.name}`,
  ];

  // Heurística por nombres comunes
  const nameLower = station.name.toLowerCase();
  if (nameLower.includes("picosa")) {
    base.push("picosa", "picosa radio", "radio picosa", "escuchar picosa radio");
  }
  if (nameLower.includes("joya")) {
    base.push("joya", "joya fm", "radio joya", "escuchar joya fm");
  }
  if (nameLower.includes("hit") || nameLower.includes("pegajosa")) {
    base.push("radio hit", "hit", "la pegajosa", "pegajosa", "la pegajosa radio");
  }
  if (nameLower.includes("accion") || nameLower.includes("acción")) {
    base.push("accion radio", "acción radio", "radio accion", "escuchar acción radio");
  }
  if (nameLower.includes("mia") || nameLower.includes("mía")) {
    base.push("mia fm", "mía fm", "radio mia", "radio mía", "escuchar mia fm", "radio mia fm");
  }

  // Tags/genre como keywords
  if (Array.isArray(station.tags)) base.push(...station.tags);
  if (station.genre) base.push(station.genre);

  // Genéricas
  base.push("radio en vivo", "radio online honduras", "emisoras online", "streaming de radio");

  // Únicas
  return Array.from(new Set(base.map((s) => s.trim()).filter(Boolean)));
}

export function buildTitle(station: Station) {
  return `Escuchar ${station.name} en vivo`;
}

export function buildDescription(station: Station) {
  return (
    station.description ||
    `Sintoniza ${station.name} en vivo. Transmisión online 24/7 con excelente calidad.`
  );
}

export function buildAlternates(station: Station) {
  return {
    canonical: `/estacion/${station.id}`, // tu ruta real
    languages: {
      "es-HN": `/estacion/${station.id}`,
      es: `/estacion/${station.id}`,
    },
  };
}

export function buildOpenGraph(station: Station, title: string, description: string) {
  return {
    type: "music.radio_station" as const,
    url: `/estacion/${station.id}`,
    siteName: "Central de Radios",
    title,
    description,
    images: [
      {
        url: station.coverImage || "/og/radios-1200x630.png",
        width: 1200,
        height: 630,
        alt: `${station.name} - portada`,
      },
    ],
    locale: "es_HN",
  };
}

export function buildTwitter(station: Station, title: string, description: string) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
    images: [station.coverImage || "/og/radios-1200x630.png"],
  };
}

export function stationToMetadata(station: Station): Metadata {
  const title = buildTitle(station);
  const description = buildDescription(station);
  const keywords = stationSynonyms(station);

  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(station),
    openGraph: buildOpenGraph(station, title, description),
    twitter: buildTwitter(station, title, description),
  };
}

// ---------- JSON-LD ----------

export function stationJsonLd(station: Station) {
  return {
    "@context": "https://schema.org",
    "@type": "RadioStation",
    name: station.name,
    url: `${SITE_URL}/estacion/${station.id}`,
    logo: station.coverImage ? `${SITE_URL}${station.coverImage}` : `${SITE_URL}/icon-512.png`,
    areaServed: station.location || "Honduras",
    broadcastFrequency: station.frequency || undefined,
    sameAs: Object.values(station.social || {}).filter(Boolean),
    parentOrganization: {
      "@type": "Organization",
      name: "Central de Radios",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
    },
  };
}

export function breadcrumbJsonLd(station: Station) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: station.name,
        item: `${SITE_URL}/estacion/${station.id}`,
      },
    ],
  };
}

export function faqJsonLd(station: Station) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cómo escuchar ${station.name} en vivo?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Presiona el botón Reproducir. Funciona en móvil y escritorio.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito registrarme?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, la transmisión es pública y no requiere registro.",
        },
      },
    ],
  };
}
