"use client";

import type { Station } from "@/lib/types";
import {
  Play,
  Pause,
  Users,
  Clock,
  Heart,
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
import { AdBanner, AdNative } from "./ad-banner";
import Link from "next/link";

interface StationDetailsProps {
  station: Station;
}

export function StationDetails({ station }: StationDetailsProps) {
  const { currentStation, isPlaying, play, pause, error } = useAudio();
  const [isFavorite, setIsFavorite] = useState(false);

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;
  const hasError = error && currentStation?.id === station.id;

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(station);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

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
    <div className="max-w-4xl mx-auto md:pb-32">
      {/* Banner publicitario 
      <div className="mb-8">
        <AdBanner adSlot="1111111111" className="text-center" />
      </div>
      */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/3 aspect-square rounded-lg overflow-hidden">
          <Image
            src={station.coverImage || "/placeholder.svg?height=400&width=400"}
            alt={station.name}
            fill
            className="object-fill"
          />
        </div>
        

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 md:mb-2 text-gray-900 dark:text-white text-center md:text-left">
            {station.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 text-center md:text-left">
            {station.genre}
          </p>

           {/* Información adicional */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
            {station.frequency && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Radio size={16} />
                <span>{station.frequency}</span>
              </div>
            )}

            {station.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} />
                <span>{station.location}</span>
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

          <div className="flex flex-wrap gap-4 mb-6 md:justify-start justify-center">
            <button
              onClick={handlePlayPause}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center space-x-2"
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
          </div>

          {/* Tags */}
          {station.tags && station.tags.length > 0 && (
            <div className="mb-6">
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

      {/* Anuncio nativo 
      <div className="my-12">
        <AdNative adSlot="2222222222" className="rounded-lg overflow-hidden" />
      </div>
      */}
      {/* Descripción General */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center md:text-left">
          Acerca de esta estación
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          {station.description ||
            "Esta estación de radio ofrece una selección de música las 24 horas del día, los 7 días de la semana. Sintoniza para disfrutar de la mejor programación musical y contenido exclusivo."}
        </p>

        {/* Locutores generales */}
        {station.locutores && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white text-center md:text-left">
              Nuestros Locutores
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {station.locutores}
            </p>
          </div>
        )}
      </div>

      {/* Sección de Programación - Solo visualización */}
      {station.programming && station.programming.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center md:text-left">
            Programación
          </h2>
          <div className="space-y-4">
            {station.programming.map((segment) => (
              <div
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redes sociales */}
      {station.social && Object.values(station.social).some((url) => !!url) && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white text-center md:text-left">
            Síguenos en Redes Sociales
          </h2>
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
        </div>
      )}
    </div>
  );
}
