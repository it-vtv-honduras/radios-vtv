"use client";

import { useEffect } from "react";
import Link from "next/link";
import { StationDetails } from "@/components/station-details";
import { Footer } from "@/components/footer";
import type { Station } from "@/lib/types";
import { useAudio } from "@/components/audio-provider";
import { AdMultiplex } from "@/components/ad-banner";

interface StationPageClientProps {
  station: Station;
  allStations: Station[];
}

export function StationPageClient({ station, allStations }: StationPageClientProps) {
  const { setStations: setAudioStations, stations } = useAudio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Cargar todas las estaciones en el contexto de audio si no están cargadas
    if (stations.length === 0 && allStations.length > 0) {
      setAudioStations(allStations);
    }
  }, [stations.length, allStations, setAudioStations]);

  return (
    <>
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

        {allStations.length > 1 && (
          <>
            <div className="max-w-4xl mx-auto mb-2">
              <aside className="mb-12">
                <h2 className="text-xl font-semibold mb-3">
                  También te puede interesar
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {allStations
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