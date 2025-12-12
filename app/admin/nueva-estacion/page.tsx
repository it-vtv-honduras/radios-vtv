"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { createStation } from "@/lib/stations.actions";
import type { Station, ProgramSegment } from "@/lib/types";

export default function NewStationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageCover, setImageCover] = useState<File | null>(null);
  const [programming, setProgramming] = useState<ProgramSegment[]>([]);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageCover(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        coverImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddSegment = () => {
    setProgramming((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        horaInicio: "",
        horaFin: "",
        segmento: "",
        locutores: "",
      },
    ]);
  };

  const handleSegmentChange = (
    index: number,
    field: keyof ProgramSegment,
    value: string
  ) => {
    setProgramming((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveSegment = (index: number) => {
    setProgramming((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newStation: Omit<Station, "id"> = {
        ...formData,
        programming,
        tags: formData.tags?.filter((tag) => tag !== "") ?? [],
      };
      console.log("Datos de la estación a crear:", newStation);
      await createStation(newStation, imageCover ?? undefined);
      router.push("/admin");
    } catch (error) {
      console.error("Error al crear estación:", error);
      alert("Error al crear la estación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container max-w-3xl mx-auto py-10 w-3/4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Registrar Nueva Estación
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
                id="genre"
                name="genre"
                type="text"
                required
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* URL de transmisión */}
            <div>
              <label
                htmlFor="streamUrl"
                className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
              >
                URL de Transmisión *
              </label>
              <input
                id="streamUrl"
                name="streamUrl"
                type="url"
                required
                value={formData.streamUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
                id="frequency"
                name="frequency"
                type="text"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Sitio web */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
              >
                Sitio Web
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
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
        {/* Info 2 */}
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
            {programming.map((segment, index) => (
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Redes Sociales
          </h2>
          {/* Redes sociales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData.social ?? {}).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={`social.${key}`}
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >{`URL de ${
                  key.charAt(0).toUpperCase() + key.slice(1)
                }`}</label>
                <input
                  id={`social.${key}`}
                  name={`social.${key}`}
                  type="url"
                  value={value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <Link
            href="/admin"
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={16} />
                Guardar Estación
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
