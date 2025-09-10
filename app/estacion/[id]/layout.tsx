import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStationById } from "@/lib/station.service";
import {
  stationToMetadata,
  stationJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo-stations";


type Props = {
  params: { id: string };
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const station = await getStationById(params.id);
    if (!station) return {};
    return stationToMetadata(station);
  } catch {
    return {};
  }
}

export default async function StationLayout({ params, children }: Props) {
  const station = await getStationById(params.id).catch(() => null);

  // Inyectamos JSON-LD sólo si existe la estación
  const ldStation = station ? stationJsonLd(station) : null;
  const ldBreadcrumb = station ? breadcrumbJsonLd(station) : null;
  const ldFaq = station ? faqJsonLd(station) : null;

  return (
    <html lang="es">
      <body>
        {children}

        {ldStation && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldStation) }}
          />
        )}
        {ldBreadcrumb && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
          />
        )}
        {ldFaq && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }}
          />
        )}
      </body>
    </html>
  );
}
