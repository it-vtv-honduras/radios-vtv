import { getAllStations } from "@/lib/stations.actions";
import { HomePage } from "@/components/home-page-client";

export const dynamic = 'force-static';

export default async function Page() {
  const stations = await getAllStations();
  return <HomePage initialStations={stations} />;
}