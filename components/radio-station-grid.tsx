"use client"

import { RadioStationCard } from "./radio-station-card"
import type { Station } from "@/lib/types"

interface RadioStationGridProps {
  stations: Station[]
}

export function RadioStationGrid({ stations }: RadioStationGridProps) {
  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No hay estaciones disponibles</p>
      </div>
    )
  }

  return (
    <>
      {/* Carrusel en móvil */}
      <div className="sm:hidden overflow-x-auto">
        <div className="flex space-x-4 px-4 pb-4">
          {stations.map((station) => (
            <div key={station.id} className="min-w-[250px] flex-shrink-0">
              <RadioStationCard station={station} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid en pantallas medianas y grandes */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <RadioStationCard key={station.id} station={station} />
        ))}
      </div>
    </>
  )
}
