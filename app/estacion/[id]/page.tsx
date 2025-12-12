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

// 🔥 Configurar como estática
export const dynamic = 'force-static';

interface PageProps {
  params: Promise<{ id: string }>; // 🔥 Ahora es Promise
}

export default async function StationPage({ params }: PageProps) {
  const { id } = await params; // 🔥 Hacer await de params
  const station = await getStationById(id);

  if (!station) {
    notFound();
  }

  // Obtener todas las estaciones para el contexto de audio
  const allStations = await getAllStations();

  return <StationPageClient station={station} allStations={allStations} />;
}