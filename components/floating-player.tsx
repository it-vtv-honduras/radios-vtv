"use client"

import type React from "react"

import { useAudio } from "./audio-provider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, AlertCircle, Radio, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function FloatingPlayer() {
  const {
    currentStation,
    isPlaying,
    volume,
    isMuted,
    error,
    stations,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    toggleMute,
  } = useAudio()

  const [isExpanded, setIsExpanded] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // Cerrar controles de volumen al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowVolumeSlider(false)
    }

    if (showVolumeSlider) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showVolumeSlider])

  if (!currentStation) {
    return null
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseInt(e.target.value))
  }

  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowVolumeSlider(!showVolumeSlider)
  }

  return (
    <>
      {/* Reproductor flotante */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800 z-50">
        {/* Mensaje de error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-800">
            <div className="container mx-auto flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Reproductor principal */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Información de la estación */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                {currentStation.coverImage ? (
                  <Image
                    src={currentStation.coverImage || "/placeholder.svg"}
                    alt={currentStation.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Radio size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm md:text-base truncate text-gray-900 dark:text-white">
                  {currentStation.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentStation.genre}</p>
              </div>
            </div>

            {/* Controles principales */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Controles de navegación (visibles en desktop o si está expandido en móvil) */}
              <div className={`flex items-center space-x-1 ${isExpanded ? "flex" : "hidden md:flex"}`}>
                <button
                  onClick={previous}
                  disabled={stations.length <= 1}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                  aria-label="Anterior"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={isPlaying ? pause : () => play()}
                  className="p-3 rounded-full bg-primary hover:bg-primary/90 text-white"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={next}
                  disabled={stations.length <= 1}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                  aria-label="Siguiente"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Control de volumen (visible en desktop o si está expandido en móvil) */}
              <div className={`relative ${isExpanded ? "flex" : "hidden md:flex"}`}>
                <button
                  onClick={handleVolumeClick}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex flex-col items-center space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
                        style={{ writingMode: "bt-lr" }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{volume}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón expandir/contraer (móvil) */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                aria-label={isExpanded ? "Contraer controles" : "Expandir controles"}
              >
                <ChevronUp
                  size={16}
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* Botón de cerrar */}
              <button
                onClick={stop}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                aria-label="Cerrar reproductor"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
