import { notFound } from "next/navigation";
import { getAllStationIds, getStationById, getAllStations } from "@/lib/stations.actions";
import { StationPageClient } from "@/components/station-page-client";

// Generar todas las páginas estáticas en build time
export async function generateStaticParams() {
  const stationIds = await getAllStationIds();
  
  return stationIds.map((id) => ({
    id: id,
  }));
}

// 🔥 Configurar como estática (se revalida con revalidatePath)
export const dynamic = 'force-static';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function StationPage({ params }: PageProps) {
  const station = await getStationById(params.id);

  if (!station) {
    notFound();
  }

  // Obtener todas las estaciones para el contexto de audio
  const allStations = await getAllStations();

  return <StationPageClient station={station} allStations={allStations} />;
}