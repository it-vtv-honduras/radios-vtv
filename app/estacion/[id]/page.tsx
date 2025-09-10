"use client"
import React from "react"
import { StationDetails } from "@/components/station-details"
import { Footer } from "@/components/footer"
import { getStationById, getAllStations } from "@/lib/station.service"
import { useEffect, useState } from "react"
import type { Station } from "@/lib/types"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useAudio } from "@/components/audio-provider"

export default function StationPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(true)
  const { setStations: setAudioStations, stations } = useAudio()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Asegura que el AudioProvider tenga la lista completa de estaciones
  // para que el reproductor flotante (next/previous) funcione correctamente.
  useEffect(() => {
    if (stations.length === 0) {
      const fetchAllStationsForProvider = async () => {
        try {
          const allStations = await getAllStations()
          setAudioStations(allStations)
        } catch (error) {
          console.error("Error fetching all stations for audio provider:", error)
        }
      }
      fetchAllStationsForProvider()
    }
  }, [stations.length, setAudioStations])
  // Carga los detalles de la estación actual
  useEffect(() => {
    const fetchStation = async () => {
      setLoading(true)
      try {
        const fetchedStation = await getStationById(unwrappedParams.id)
        setStation(fetchedStation)
      } catch (error) {
        console.error("Error fetching station:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStation()
  }, [unwrappedParams.id])

  if (loading) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!station) {
    return (
      <>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Estación no encontrada</h1>
            <Link href="/" className="text-primary hover:underline">
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <StationDetails station={station} />
      </main>
      <Footer />
    </>
  )
}
