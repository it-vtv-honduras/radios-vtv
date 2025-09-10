import type { Station } from "./types"
import { getAllStations } from "./station.service"

export async function getMockStations(): Promise<Station[]> {
  const data = await getAllStations()
  return data.map(station => ({
    ...station,
    isActive: station.isActive !== false
  }))
}

export async function getMockStationById(id: string): Promise<Station | null> {
  const stations = await getAllStations()
  const station = stations.find(s => s.id === id)
  return station ? { ...station } : null
}