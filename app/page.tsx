"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { RadioStationGrid } from "@/components/radio-station-grid";
import { FeaturedStation } from "@/components/featured-station";
import { Footer } from "@/components/footer";
import { getAllStations } from "@/lib/station.service";
import type { Station } from "@/lib/types";
import { useAudio } from "@/components/audio-provider";
import { AdBanner, AdMultiplex } from "@/components/ad-banner";

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const { setStations: setAudioStations } = useAudio();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchStations = async () => {
      try {
        const fetchedStations = await getAllStations();
        setStations(fetchedStations);
        setAudioStations(fetchedStations);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [setAudioStations]);

  // ---- ESTADOS ----
  if (loading) {
    // NUNCA mostrar anuncios en loading
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
        </div>
      </main>
    );
  }

  // Página sin estaciones: muestra contenido editorial (sin anuncios)
  if (!stations.length) {
    return (
      <>
        <main className="container mx-auto px-4 py-8 md:pb-32">
          <h1 className="text-3xl font-bold text-center mb-6">
            Radios Grupo VTV
          </h1>
          <p className="mx-auto max-w-2xl text-center text-gray-700 dark:text-gray-300">
            Bienvenido a la plataforma oficial de radios de Grupo VTV. Estamos
            actualizando nuestra lista de emisoras. Mientras tanto, descubre
            nuestra programación, géneros musicales y cobertura a nivel
            nacional. Vuelve en unos minutos para escuchar en vivo.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // Con contenido real: ahora sí podemos mostrar anuncios
  const featuredStation = stations[0];
  const canShowAds = stations.length > 0;

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:pb-32">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Radios Grupo VTV
        </h1>
        <p className="mx-auto max-w-2xl text-center mb-8 text-gray-700 dark:text-gray-300">
          Escucha en vivo nuestras emisoras y descubre programación, locutores y
          géneros para cada momento del día.
        </p>

        {featuredStation && (
          <section className="mb-10 w-full lg:w-1/2 md:w-3/4 mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center md:text-left">
              Estación destacada
            </h2>
            <FeaturedStation station={featuredStation} />
          </section>
        )}

         {/* Banner superior*/}
        {canShowAds && (
          <div className="mt-16 mb-8 pt-8 w-full md:w-4/6 mx-auto">
            <AdBanner
              adSlot="8671563719"
              adFormat="auto"
              className="text-center"
            />
          </div>
        )}

        <section className="mb-16 w-full md:w-4/6 mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Todas las estaciones
          </h2>
          <RadioStationGrid stations={stations} />
        </section>

        {/* Banner inferior (MULTIPLEX) */}
        {canShowAds && (
          <AdMultiplex
            adSlot="3605147280"
            className="w-full md:w-4/6 mx-auto my-10"
          />
        )}
      </main>

      <Footer />
    </>
  );
}
