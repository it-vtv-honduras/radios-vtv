import type { Station } from "./types"
import { getMockStations } from "./mock-data"

// Simulamos una base de datos local con localStorage
const STATIONS_KEY = "radio_stations"

export async function getAllStations(): Promise<Station[]> {
  // Intentar cargar desde localStorage primero
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STATIONS_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error parsing stored stations:", error)
      }
    }
  }

  // Si no hay datos almacenados, usar datos mock y guardarlos
  const mockStations = getMockStations()
  if (typeof window !== "undefined") {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(mockStations))
  }
  return mockStations
}

export async function getStationById(id: string): Promise<Station | null> {
  const stations = await getAllStations()
  return stations.find((station) => station.id === id) || null
}

export async function createStation(station: Omit<Station, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const stations = await getAllStations()
  const newStation: Station = {
    ...station,
    id: `station-${Date.now()}`,
    isActive: true
  }

  stations.push(newStation)

  if (typeof window !== "undefined") {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations))
  }

  return newStation.id
}

export async function updateStation(id: string, stationData: Partial<Station>): Promise<void> {
  const stations = await getAllStations()
  const index = stations.findIndex((station) => station.id === id)

  if (index === -1) {
    throw new Error("Station not found")
  }

  stations[index] = {
    ...stations[index],
    ...stationData
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations))
  }
}

export async function deleteStation(id: string): Promise<void> {
  const stations = await getAllStations()
  const index = stations.findIndex((station) => station.id === id)

  if (index === -1) {
    throw new Error("Station not found")
  }

  stations[index] = {
    ...stations[index],
    isActive: false
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(stations))
  }
}


export function validateImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP)")
    return false
  }

  if (file.size > maxSize) {
    alert("El archivo es demasiado grande. Máximo 5MB.")
    return false
  }

  return true
}
