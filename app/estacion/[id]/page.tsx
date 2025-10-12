"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { StationDetails } from "@/components/station-details";
import { Footer } from "@/components/footer";
import { getStationById, getAllStations } from "@/lib/station.service";
import type { Station } from "@/lib/types";
import { useAudio } from "@/components/audio-provider";
import { AdMultiplex } from "@/components/ad-banner";

export default function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const { setStations: setAudioStations, stations } = useAudio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (stations.length === 0) {
      (async () => {
        try {
          const all = await getAllStations();
          setAudioStations(all);
        } catch (e) {
          console.error("Error fetching all stations for audio provider:", e);
        }
      })();
    }
  }, [stations.length, setAudioStations]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetched = await getStationById(unwrappedParams.id);
        setStation(fetched);
      } catch (e) {
        console.error("Error fetching station:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!station) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <nav className="mb-6 text-sm">
            <ol className="flex gap-2 text-gray-500">
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 dark:text-gray-100">
                No encontrada
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Estación no encontrada
          </h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            La página solicitada no existe o fue movida. Te invitamos a explorar
            nuestras emisoras en vivo.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const ldRadio = {
    "@context": "https://schema.org",
    "@type": "RadioStation",
    name: station.name,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    genre: station.genre ?? undefined,
    sameAs: station.website ?? undefined,
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
      { "@type": "ListItem", position: 3, name: station.name },
    ],
  };

  return (
    <>
      <Script
        id="ld-radio"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(ldRadio)}
      </Script>
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(ldBreadcrumbs)}
      </Script>

      <main className="container mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-gray-100">{station.name}</li>
          </ol>
        </nav>

        <section className="mb-2">
          <StationDetails station={station} />
        </section>

        {stations.length > 1 && (
          <>
            <div className="max-w-4xl mx-auto mb-2">
              <aside className="mb-12">
                <h2 className="text-xl font-semibold mb-3">
                  También te puede interesar
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {stations
                    .filter((s) => s.id !== station.id)
                    .slice(0, 5)
                    .map((s) => (
                      <li key={s.id}>
                        <Link
                          className="hover:underline"
                          href={`/estacion/${s.id}`}
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </aside>
            </div>

            <AdMultiplex
              adSlot="2044653605"
              className="w-full md:w-4/6 mx-auto my-10"
            />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
