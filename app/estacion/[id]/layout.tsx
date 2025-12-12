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

type Props = { params: { id: string }; children: ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const station = await getStationById(params.id);
    return station ? stationToMetadata(station) : {};
  } catch {
    return {};
  }
}

export default async function StationLayout({ params, children }: Props) {
  const station = await getStationById(params.id).catch(() => null);

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
