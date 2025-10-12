"use client";

import type { Station } from "@/lib/types";
import {
  Play,
  Pause,
  Clock,
  AlertCircle,
  ExternalLink,
  MapPin,
  Radio,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useAudio } from "./audio-provider";
import { useState } from "react";
import Link from "next/link";
import { AdBanner } from "./ad-banner";

interface StationDetailsProps {
  station: Station;
}

export function StationDetails({ station }: StationDetailsProps) {
  const { currentStation, isPlaying, play, pause, error } = useAudio();
  const [isFavorite, setIsFavorite] = useState(false);

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;
  const hasError = error && currentStation?.id === station.id;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) pause();
    else play(station);
  };

  const toggleFavorite = () => setIsFavorite((v) => !v);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook size={20} />;
      case "twitter":
        return <Twitter size={20} />;
      case "instagram":
        return <Instagram size={20} />;
      case "youtube":
        return <Youtube size={20} />;
      case "whatsapp":
        return <MessageCircle size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
  };

  return (
    <article
      className="max-w-4xl mx-auto md:pb-30"
      itemScope
      itemType="https://schema.org/RadioStation"
      aria-labelledby="station-title"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <figure className="relative w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
          <Image
            src={station.coverImage || "/placeholder.svg?height=400&width=400"}
            alt={`Logo o portada de ${station.name}`}
            fill
            className="object-fill"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
          {/* Microdato de logo */}
          <meta itemProp="logo" content={station.coverImage || ""} />
        </figure>

        <div className="flex-1">
          {/* Importante: H1 debe estar en la página, aquí usamos H2 */}
          <h2
            id="station-title"
            className="text-3xl font-bold mb-4 md:mb-2 text-gray-900 dark:text-white text-center md:text-left"
            itemProp="name"
          >
            {station.name}
          </h2>

          {station.genre && (
            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-4 text-center md:text-left"
              itemProp="genre"
            >
              {station.genre}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
            {station.frequency && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Radio size={16} />
                <span>{station.frequency}</span>
              </div>
            )}

            {station.location && (
              <div
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin size={16} />
                <span itemProp="addressLocality">{station.location}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} />
              <span>24/7</span>
            </div>
          </div>

          {hasError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Controles */}
          <div className="flex flex-wrap gap-4 mb-6 md:justify-start justify-center">
            <button
              onClick={handlePlayPause}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center space-x-2"
              aria-pressed={!!isCurrentlyPlaying}
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause size={20} />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play size={20} />
                  <span>Reproducir</span>
                </>
              )}
            </button>

            {/* Favorito (estado accesible) */}
            <button
              onClick={toggleFavorite}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300"
              aria-pressed={isFavorite}
            >
              Favorito
            </button>
          </div>

          {/* Tags */}
          {station.tags && station.tags.length > 0 && (
            <div className="mb-6" aria-label="Etiquetas de la estación">
              <div className="flex flex-wrap gap-1">
                {station.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 w-full">
        <AdBanner adSlot="6394962158" adFormat="auto" className="text-center" />
      </div>

      {/* Descripción */}
      {(station.description || station.locutores) && (
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center md:text-left">
            Acerca de esta estación
          </h3>

          {station.description && (
            <p
              className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5"
              itemProp="description"
            >
              {station.description}
            </p>
          )}

          {station.locutores && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center md:text-left">
                Nuestros Locutores
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {station.locutores}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Programación */}
      {station.programming && station.programming.length > 0 && (
        <section className="mt-6" aria-label="Programación">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center md:text-left">
            Programación
          </h3>
          <div className="space-y-4">
            {station.programming.map((segment) => (
              <article
                key={segment.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-mono font-semibold">
                    {segment.horaInicio} – {segment.horaFin}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold">
                    Segmento: {segment.segmento}
                  </span>
                </div>
                {segment.locutores && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {segment.locutores}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Redes sociales */}
      {station.social && Object.values(station.social).some(Boolean) && (
        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white text-center md:text-left">
            Síguenos en Redes Sociales
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(station.social).map(([platform, url]) => {
              if (!url) return null;
              return (
                <Link
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {getSocialIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
