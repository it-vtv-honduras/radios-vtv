"use client"

import type React from "react"

import type { Station } from "@/lib/types"
import { Play, Pause, AlertCircle, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAudio } from "./audio-provider"

interface RadioStationCardProps {
  station: Station
}

export function RadioStationCard({ station }: RadioStationCardProps) {
  const { currentStation, isPlaying, play, pause, error } = useAudio()

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying
  const hasError = error && currentStation?.id === station.id

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentlyPlaying) {
      pause()
    } else {
      play(station)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group">
      {/* Contenedor de imagen CORREGIDO */}
      <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-900">
        <Image
          src={station.coverImage || "/placeholder.svg?height=300&width=300"}
          alt={station.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Indicador de reproducción activa */}
        {isCurrentlyPlaying && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span>En vivo</span>
            </div>
          </div>
        )}
      </div>

      {/* Información de la estación */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1 text-base">
          {station.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
          {station.genre}
        </p>

        {/* Mensaje de error */}
        {hasError && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-center gap-1.5 border border-red-200 dark:border-red-800">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span className="text-xs">Error de reproducción</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all hover:shadow-md active:scale-95"
            aria-label={isCurrentlyPlaying ? "Pausar" : "Reproducir"}
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause size={16} fill="currentColor" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Play</span>
              </>
            )}
          </button>

          <Link
            href={`/estacion/${station.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all hover:shadow-sm active:scale-95"
            aria-label={`Ver más sobre ${station.name}`}
          >
            <Eye size={16} />
            <span>Ver más</span>
          </Link>
        </div>
      </div>
    </div>
  )
}