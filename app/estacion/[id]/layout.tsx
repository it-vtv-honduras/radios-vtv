// app/estacion/[id]/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStationById } from "@/lib/stations.actions";
import {
  stationToMetadata,
  stationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo-stations";

// 🔥 Ahora params es una Promise
type Props = { 
  params: Promise<{ id: string }>; 
  children: ReactNode 
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params; // 🔥 Hacer await de params
    const station = await getStationById(id);
    return station ? stationToMetadata(station) : {};
  } catch {
    return {};
  }
}

export default async function StationLayout({ params, children }: Props) {
  const { id } = await params; // 🔥 Hacer await de params
  const station = await getStationById(id).catch(() => null);

  const jsonLd = station
    ? [stationJsonLd(station), breadcrumbJsonLd(station), faqJsonLd(station)]
    : [];

  return (
    <>
      {children}
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}