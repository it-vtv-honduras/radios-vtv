"use client"

import { useState, useEffect } from "react"
import { getAllStations, deleteStation } from "@/lib/stations.actions"
import type { Station } from "@/lib/types"
import { Plus, Edit, Trash2, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"

function AdminPageContent() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  // Asegurar scroll al top al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      const fetchedStations = await getAllStations()
      console.log("Estaciones obtenidas:", fetchedStations)
      setStations(fetchedStations.filter((s) => s.isActive !== false))
    } catch (error) {
      console.error("Error fetching stations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta estación?")) {
      try {
        await deleteStation(id)
        await fetchStations()
      } catch (error) {
        console.error("Error deleting station:", error)
        alert("Error al eliminar la estación")
      }
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Cargando...</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
        <Link
          href="/admin/nueva-estacion"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Estación
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Estaciones de Radio</h2>
        </div>

        {stations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay estaciones configuradas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stations.map((station) => (
              <div
                key={station.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <Image
                      src={station.coverImage || "/placeholder.svg?height=100&width=100"}
                      alt={station.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{station.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{station.genre}</p>
                    {station.programming && (
                      <p className="text-xs text-primary">
                        {station.programming.length} segmento{station.programming.length !== 1 ? "s" : ""} de
                        programación
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/editar-estacion/${station.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    title="Editar Estación"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(station.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="Eliminar Estación"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  )
}
