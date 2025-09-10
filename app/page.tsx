"use client";

import { RadioStationGrid } from "@/components/radio-station-grid";
import { FeaturedStation } from "@/components/featured-station";
//import { AdBanner, AdNative } from "@/components/ad-banner";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import { getAllStations } from "@/lib/station.service";
import type { Station } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useAudio } from "@/components/audio-provider";

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const { setStations: setAudioStations } = useAudio();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchStations = async () => {
      try {
        const fetchedStations = await getAllStations();
        console.log("Estaciones obtenidas:", fetchedStations);
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

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 ">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            
          </div>
        </div>
      </main>
    );
  }

  const featuredStation = stations[0];

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:pb-32">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Radio Stream
        </h1>

        {featuredStation && (
          <section className="mb-12 w-full lg:w-1/2 md:w-3/4 mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center md:text-left">
              Estación Destacada
            </h2>
            <FeaturedStation station={featuredStation} />
          </section>
        )}

        {/* Anuncio nativo entre secciones
          <div className="mb-8">
            <AdNative adSlot="0987654321" className="rounded-lg overflow-hidden" />
          </div>
        */}
        <section className="mb-16 w-full md:w-4/6 mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Todas las Estaciones
          </h2>
          <RadioStationGrid stations={stations} />
        </section>

        {/* Separador visual antes de la publicidad 
          <div className="border-t border-gray-200 dark:border-gray-700 my-12"></div>
        */}
        
        {/* Banner publicitario inferior con espaciado
        <div className="mt-16 mb-8 pt-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <AdBanner adSlot="1122334455" adFormat="horizontal" className="text-center" />
          </div>
        </div>
         */}
      </main>

      <Footer />
    </>
  );
}
