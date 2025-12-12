"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Station, AudioState } from "@/lib/types";

type AudioContextType = AudioState & {
  stations: Station[];
  isLoading: boolean;
  play: (station?: Station) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setStations: (stations: Station[]) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>({
    currentStation: null,
    currentIndex: -1,
    isPlaying: false,
    volume: 80,
    isMuted: false,
    error: null,
  });

  // Inicializar el audio solo cuando sea necesario (lazy initialization)
  const initAudio = useCallback(() => {
    if (audioRef.current) {
      return audioRef.current;
    }

    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.8;

    // Event listeners para estados de carga
    audio.addEventListener("loadstart", () => {
      setIsLoading(true);
    });

    audio.addEventListener("canplay", () => {
      setIsLoading(false);
      setAudioState((prev) => ({ ...prev, error: null }));
    });

    audio.addEventListener("canplaythrough", () => {
      setIsLoading(false);
    });

    audio.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    audio.addEventListener("playing", () => {
      setIsLoading(false);
    });

    audio.addEventListener("error", () => {
      setIsLoading(false);

      if (!audio.src || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        return;
      }

      const audioError = audio.error;
      if (!audioError) return;

      let errorMsg = "Error al reproducir la estación. Intente con otra.";
      switch (audioError.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMsg = "La reproducción fue abortada.";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMsg = "Error de red al reproducir.";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMsg = "Formato no compatible.";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Fuente no válida.";
          break;
      }

      setAudioState((prev) => ({
        ...prev,
        error: errorMsg,
        isPlaying: false,
      }));
    });

    audio.addEventListener("ended", () => {
      setIsLoading(false);
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener("pause", () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener("play", () => {
      setAudioState((prev) => ({ ...prev, isPlaying: true, error: null }));
    });

    audioRef.current = audio;
    return audio;
  }, []);

  // Actualizar volumen
  const updateVolume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.isMuted ? 0 : audioState.volume / 100;
    }
  }, [audioState.volume, audioState.isMuted]);

  useEffect(() => {
    updateVolume();
  }, [updateVolume]);

  const play = useCallback((station?: Station) => {
    const audio = initAudio();
    
    if (station) {
      const stationIndex = stations.findIndex((s) => s.id === station.id);

      // 🔥 Establecer la estación INMEDIATAMENTE antes de cargar
      setAudioState((prev) => ({
        ...prev,
        currentStation: station,
        currentIndex: stationIndex,
        error: null,
      }));
      setIsLoading(true);

      if (audioState.currentStation?.id === station.id) {
        audio
          .play()
          .then(() => {
            setAudioState((prev) => ({ ...prev, isPlaying: true }));
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsLoading(false);
            setAudioState((prev) => ({
              ...prev,
              error: "No se pudo reproducir esta estación.",
              isPlaying: false,
            }));
          });
      } else {
        audio.src = station.streamUrl;
        audio
          .play()
          .then(() => {
            setAudioState((prev) => ({
              ...prev,
              isPlaying: true,
              error: null,
            }));
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsLoading(false);
            setAudioState((prev) => ({
              ...prev,
              error: "No se pudo reproducir esta estación.",
              isPlaying: false,
            }));
          });
      }
    } else if (audioState.currentStation) {
      setAudioState((prev) => ({ ...prev, error: null }));
      setIsLoading(true);
      
      audio
        .play()
        .then(() => {
          setAudioState((prev) => ({ ...prev, isPlaying: true }));
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsLoading(false);
          setAudioState((prev) => ({
            ...prev,
            error: "No se pudo reproducir esta estación.",
            isPlaying: false,
          }));
        });
    }
  }, [initAudio, stations, audioState.currentStation]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsLoading(false);
    setAudioState((prev) => ({
      ...prev,
      currentStation: null,
      currentIndex: -1,
      isPlaying: false,
      error: null,
    }));
  }, []);

  const next = useCallback(() => {
    if (stations.length === 0) return;

    const nextIndex = (audioState.currentIndex + 1) % stations.length;
    const nextStation = stations[nextIndex];
    if (nextStation) {
      play(nextStation);
    }
  }, [stations, audioState.currentIndex, play]);

  const previous = useCallback(() => {
    if (stations.length === 0) return;

    const newIndex =
      audioState.currentIndex <= 0
        ? stations.length - 1
        : audioState.currentIndex - 1;
    const prevStation = stations[newIndex];
    if (prevStation) {
      play(prevStation);
    }
  }, [stations, audioState.currentIndex, play]);

  const setVolume = useCallback((volume: number) => {
    setAudioState((prev) => ({
      ...prev,
      volume: Math.max(0, Math.min(100, volume)),
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setAudioState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  return (
    <AudioContext.Provider
      value={{
        ...audioState,
        stations,
        isLoading,
        play,
        pause,
        stop,
        next,
        previous,
        setVolume,
        toggleMute,
        setStations,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}