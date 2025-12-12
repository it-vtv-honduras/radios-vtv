"use client";

import type React from "react";

import { Play, Pause, Users, AlertCircle, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAudio } from "./audio-provider";
import type { Station } from "@/lib/types";

interface FeaturedStationProps {
  station: Station;
}

export function FeaturedStation({ station }: FeaturedStationProps) {
  const { currentStation, isPlaying, play, pause, error } = useAudio();

  const isCurrentlyPlaying = currentStation?.id === station.id && isPlaying;
  const hasError = error && currentStation?.id === station.id;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(station);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto">
          <Image
            src={station.coverImage || "/placeholder.svg?height=400&width=400"}
            alt={station.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1280px) 100vw, 35vw"
          />

          {/* Indicador de reproducción activa */}
          {isCurrentlyPlaying && (
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                ♪ En vivo
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {station.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {station.genre}
            </p>

            {hasError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-center gap-2 border border-red-200 dark:border-red-800">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full max-w-md">
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors w-full"
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause size={15} />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play size={15} />
                  <span>Play</span>
                </>
              )}
            </button>

            <Link
              href={`/estacion/${station.id}`}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors w-full"
            >
              <Eye size={15} />
              <span>Ver más</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}