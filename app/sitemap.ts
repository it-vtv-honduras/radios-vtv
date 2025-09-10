// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllStations } from "@/lib/station.service";
import { stationSynonyms, normalize } from "@/lib/seo-stations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stream-radios.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stations = await getAllStations();

  const base: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const stationUrls: MetadataRoute.Sitemap = stations.map((s) => ({
    url: `${SITE_URL}/estacion/${s.id}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const aliases: MetadataRoute.Sitemap = stations.flatMap((s) => {
    const syns = stationSynonyms(s);
    return syns.flatMap((syn) => {
      const aliasSlug = normalize(syn);
      return [
        {
          url: `${SITE_URL}/escuchar/${aliasSlug}-radio`,
          changeFrequency: "weekly",
          priority: 0.85,
        },
        {
          url: `${SITE_URL}/radio/${aliasSlug}-en-vivo`,
          changeFrequency: "weekly",
          priority: 0.85,
        },
      ];
    });
  });

  return [...base, ...stationUrls, ...aliases];
}
