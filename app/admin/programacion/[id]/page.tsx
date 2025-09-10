"use client"

import { useState, useEffect } from "react"
import { getStationById, updateStation } from "@/lib/stations"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Clock, Save } from "lucide-react"
import Link from "next/link"
import type { Station, ProgramSegment } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Loader2 } from "lucide-react"

function ProgrammingPageContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [station, setStation] = useState<Station | null>(null)
  const [showAddSegment, setShowAddSegment] = useState(false)
  const [newSegment, setNewSegment] = useState({
    horaInicio: "",
    horaFin: "",
    segmento: "",
    locutores: "",
  })

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const fetchedStation = await getStationById(params.id)
        setStation(fetchedStation)
      } catch (error) {
        console.error("Error fetching station:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStation()
  }, [params.id])

  const handleAddSegment = async () => {
    if (!newSegment.horaInicio || !newSegment.horaFin || !newSegment.segmento) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    if (!station) return

    setSaving(true)

    const segment: ProgramSegment = {
      id: `segment-${Date.now()}`,
      ...newSegment,
    }

    const updatedProgramming = [...(station.programming || []), segment]

    try {
      await updateStation(station.id, { programming: updatedProgramming })
      setStation((prev) => (prev ? { ...prev, programming: updatedProgramming } : null))
      setNewSegment({ horaInicio: "", horaFin: "", segmento: "", locutores: "" })
      setShowAddSegment(false)
    } catch (error) {
      console.error("Error adding segment:", error)
      alert("Error al agregar el segmento")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSegment = async (segmentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este segmento?")) return
    if (!station) return

    setSaving(true)

    const updatedProgramming = station.programming?.filter((s) => s.id !== segmentId) || []

    try {
      await updateStation(station.id, { programming: updatedProgramming })
      setStation((prev) => (prev ? { ...prev, programming: updatedProgramming } : null))
    } catch (error) {
      console.error("Error deleting segment:", error)
      alert("Error al eliminar el segmento")
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">Cargando estación...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!station) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Estación no encontrada</p>
          <Link href="/admin" className="text-primary hover:underline">
            Volver al panel de administración
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programación</h1>
            <p className="text-gray-600 dark:text-gray-300">{station.name}</p>
          </div>
        </div>

        {/* Botón para agregar segmento */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Segmentos de Programación</h2>
          <button
            onClick={() => setShowAddSegment(!showAddSegment)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
          >
            <Plus size={18} />
            Agregar Segmento
          </button>
        </div>

        {/* Formulario para agregar segmento */}
        {showAddSegment && (
          <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Nuevo Segmento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Hora de Inicio *</label>
                <input
                  type="time"
                  value={newSegment.horaInicio}
                  onChange={(e) => setNewSegment((prev) => ({ ...prev, horaInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Hora de Fin *</label>
                <input
                  type="time"
                  value={newSegment.horaFin}
                  onChange={(e) => setNewSegment((prev) => ({ ...prev, horaFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Nombre del Segmento *
                </label>
                <input
                  type="text"
                  value={newSegment.segmento}
                  onChange={(e) => setNewSegment((prev) => ({ ...prev, segmento: e.target.value }))}
                  placeholder="ej: Mañanas alegres"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Locutores</label>
                <input
                  type="text"
                  value={newSegment.locutores}
                  onChange={(e) => setNewSegment((prev) => ({ ...prev, locutores: e.target.value }))}
                  placeholder="ej: Con Juan Horlando y Xiomara Castro"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddSegment}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar Segmento"}
              </button>
              <button
                onClick={() => setShowAddSegment(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de segmentos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={20} />
              Programación Actual
            </h3>
          </div>

          {station.programming && station.programming.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {station.programming
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map((segment) => (
                  <div key={segment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span className="font-mono font-semibold text-primary">
                            {formatTime(segment.horaInicio)} – {formatTime(segment.horaFin)}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="font-semibold">Segmento: {segment.segmento}</span>
                        </div>
                        {segment.locutores && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{segment.locutores}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSegment(segment.id)}
                        disabled={saving}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No hay segmentos de programación configurados</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Haz clic en "Agregar Segmento" para comenzar
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ProgrammingPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ProgrammingPageContent params={params} />
    </ProtectedRoute>
  )
}
