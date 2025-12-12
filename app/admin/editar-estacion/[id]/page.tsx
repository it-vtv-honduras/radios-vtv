"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";

import { getStationById, updateStation } from "@/lib/stations.actions";
import type { Station, ProgramSegment } from "@/lib/types";
import { ProtectedRoute } from "@/components/protected-route";

export default function EditStationPageContent({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [station, setStation] = useState<Station | null>(null);
  const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Omit<Station, "id">>({
    name: "",
    genre: "",
    coverImage: "",
    streamUrl: "",
    description: "",
    isActive: true,
    frequency: "",
    location: "",
    website: "",
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: "",
      whatsapp: "",
    },
    tags: [],
    programming: [],
    locutores: "",
  });

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const fetchedStation = await getStationById(unwrappedParams.id);
        if (fetchedStation) {
          setStation(fetchedStation);
          setFormData({
            name: fetchedStation.name,
            genre: fetchedStation.genre,
            coverImage: fetchedStation.coverImage || "",
            streamUrl: fetchedStation.streamUrl,
            description: fetchedStation.description || "",
            isActive: fetchedStation.isActive ?? true,
            frequency: fetchedStation.frequency || "",
            location: fetchedStation.location || "",
            website: fetchedStation.website || "",
            social: {
              facebook: fetchedStation.social?.facebook || "",
              twitter: fetchedStation.social?.twitter || "",
              instagram: fetchedStation.social?.instagram || "",
              youtube: fetchedStation.social?.youtube || "",
              whatsapp: fetchedStation.social?.whatsapp || "",
            },
            tags: fetchedStation.tags || [],
            programming: fetchedStation.programming || [],
            locutores: fetchedStation.locutores || "",
          });
        }
      } catch (error) {
        console.error("Error fetching station:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchStation();
  }, [unwrappedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: Station = {
        ...station!,
        ...formData,
        social: {
          facebook: formData.social?.facebook || "",
          twitter: formData.social?.twitter || "",
          instagram: formData.social?.instagram || "",
          youtube: formData.social?.youtube || "",
          whatsapp: formData.social?.whatsapp || "",
        },
      };

      await updateStation(
        unwrappedParams.id,
        updateData,
        newCoverImageFile || undefined
      );

      router.push("/admin");
    } catch (error) {
      console.error("Error updating station:", error);
      alert("Error al actualizar la estación");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > maxSize) {
      alert("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    setNewCoverImageFile(file);
    setFormData((prev) => ({
      ...prev,
      coverImage: URL.createObjectURL(file),
    }));
  };

  const handleAddSegment = () => {
    setFormData((prev) => ({
      ...prev,
      programming: [
        ...(prev.programming || []),
        {
          id: crypto.randomUUID(),
          horaInicio: "",
          horaFin: "",
          segmento: "",
          locutores: "",
        },
      ],
    }));
  };

  const handleSegmentChange = (
    index: number,
    field: keyof ProgramSegment,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.programming || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, programming: updated };
    });
  };

  // Cambia handleRemoveSegment:
  const handleRemoveSegment = (index: number) => {
    setFormData((prev) => {
      const updated = [...(prev.programming || [])];
      updated.splice(index, 1);
      return { ...prev, programming: updated };
    });
  };

  if (initialLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">
              Cargando estación...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (!station) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Estación no encontrada</p>
          <Link href="/admin" className="text-primary hover:underline">
            Volver al panel de administración
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
         <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Estación
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre Estacion */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Nombre de la Estación *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* Género */}
              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Género *
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* URL de Stream */}
              <div>
                <label
                  htmlFor="streamUrl"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  URL de Stream *
                </label>
                <input
                  type="url"
                  id="streamUrl"
                  name="streamUrl"
                  value={formData.streamUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* Frecuencia */}
              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Frecuencia
                </label>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  placeholder="ej: 101.5 FM"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* Ubicación */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ej: Ciudad de México"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* Sitio Web */}
              <div className="md:col-span-2">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Sitio Web
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {/* Descripción */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Imagen de Portada
            </h2>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Formatos soportados: JPG, PNG, GIF, WebP. Máximo 5MB.
            </p>

            {formData.coverImage && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Vista previa:
                </p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  <Image
                    src={formData.coverImage || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Descripciones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Locutores */}
              <div>
                <label
                  htmlFor="locutores"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Locutores
                </label>
                <input
                  id="locutores"
                  name="locutores"
                  type="text"
                  value={formData.locutores}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Etiquetas
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="pop, latina, reggaeton"
                  value={formData.tags?.join(",") ?? ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Programación */}
            <div className="mt-5">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Programación
              </h3>
              {formData.programming?.map((segment, index) => (
                <div
                  key={segment.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center mb-4"
                >
                  <input
                    type="text"
                    placeholder="Segmento"
                    value={segment.segmento}
                    onChange={(e) =>
                      handleSegmentChange(index, "segmento", e.target.value)
                    }
                    className="px-2 py-1 border rounded-md"
                  />
                  <input
                    type="time"
                    placeholder="Hora Inicio"
                    value={segment.horaInicio}
                    onChange={(e) =>
                      handleSegmentChange(index, "horaInicio", e.target.value)
                    }
                    className="px-2 py-1 border rounded-md"
                  />
                  <input
                    type="time"
                    placeholder="Hora Fin"
                    value={segment.horaFin}
                    onChange={(e) =>
                      handleSegmentChange(index, "horaFin", e.target.value)
                    }
                    className="px-2 py-1 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Locutores"
                    value={segment.locutores}
                    onChange={(e) =>
                      handleSegmentChange(index, "locutores", e.target.value)
                    }
                    className="px-2 py-1 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSegment(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSegment}
                className="flex items-center text-blue-600 mt-2"
              >
                <Plus size={16} className="mr-1" /> Agregar segmento
              </button>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Redes Sociales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.social?.facebook}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social: {
                        ...prev.social,
                        facebook: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://facebook.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.social?.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={formData.social?.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social: {
                        ...prev.social,
                        instagram: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://instagram.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="youtube"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  Youtube
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={formData.social?.youtube}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social: {
                        ...prev.social,
                        youtube: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://youtube.com/tu-estacion"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  WhatsApp
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.social?.whatsapp}
                  onChange={handleChange}
                  placeholder="+504-9876-5432"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
    </ProtectedRoute>
 
  );
}


