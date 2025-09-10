"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Station, AudioState } from "@/lib/types";

type AudioContextType = AudioState & {
  stations: Station[];
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
  const [audioState, setAudioState] = useState<AudioState>({
    currentStation: null,
    currentIndex: -1,
    isPlaying: false,
    volume: 80,
    isMuted: false,
    error: null,
  });
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";

    audio.addEventListener("loadstart", () => {
      setAudioState((prev) => ({ ...prev, error: null }));
    });

    audio.addEventListener("canplay", () => {
      setAudioState((prev) => ({ ...prev, error: null }));
    });

    audio.addEventListener("error", (e) => {
      const audioError = audioRef.current?.error;
      let errorMsg = "Error al reproducir la estación. Intente con otra.";
      if (audioError) {
        switch (audioError.code) {
          case 1:
            errorMsg = "La reproducción fue abortada por el usuario.";
            break;
          case 2:
            errorMsg = "Error de red al intentar reproducir la estación.";
            break;
          case 3:
            errorMsg =
              "El formato de la estación no es compatible o está dañado.";
            break;
          case 4:
            errorMsg =
              "No se pudo encontrar una fuente válida para la estación.";
            break;
          default:
            errorMsg = "Error desconocido al reproducir la estación.";
        }
      }
      console.error("Audio error:", audioError);
      setAudioState((prev) => ({
        ...prev,
        error: errorMsg,
        isPlaying: false,
      }));
    });

    audio.addEventListener("ended", () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener("pause", () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener("play", () => {
      setAudioState((prev) => ({ ...prev, isPlaying: true, error: null }));
    });
    audio.volume = audioState.volume / 100;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("loadstart", () => {});
      audio.removeEventListener("canplay", () => {});
      audio.removeEventListener("error", () => {});
      audio.removeEventListener("ended", () => {});
      audio.removeEventListener("pause", () => {});
      audio.removeEventListener("play", () => {});
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.isMuted
        ? 0
        : audioState.volume / 100;
    }
  }, [audioState.volume, audioState.isMuted]);

  const play = (station?: Station) => {
    if (!audioRef.current) return;

    setAudioState((prev) => ({ ...prev, error: null }));

    if (station) {
      const stationIndex = stations.findIndex((s) => s.id === station.id);

      if (audioState.currentStation?.id === station.id) {
        audioRef.current
          .play()
          .then(() => {
            setAudioState((prev) => ({ ...prev, isPlaying: true }));
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setAudioState((prev) => ({
              ...prev,
              error: "No se pudo reproducir esta estación.",
              isPlaying: false,
            }));
          });
      } else {
        audioRef.current.src = station.streamUrl;
        audioRef.current
          .play()
          .then(() => {
            setAudioState((prev) => ({
              ...prev,
              currentStation: station,
              currentIndex: stationIndex,
              isPlaying: true,
              error: null,
            }));
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setAudioState((prev) => ({
              ...prev,
              error: "No se pudo reproducir esta estación.",
              isPlaying: false,
            }));
          });
      }
    } else if (audioState.currentStation) {
      audioRef.current
        .play()
        .then(() => {
          setAudioState((prev) => ({ ...prev, isPlaying: true }));
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setAudioState((prev) => ({
            ...prev,
            error: "No se pudo reproducir esta estación.",
            isPlaying: false,
          }));
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState((prev) => ({
      ...prev,
      currentStation: null,
      currentIndex: -1,
      isPlaying: false,
      error: null,
    }));
  };

  const next = () => {
    if (stations.length === 0) return;

    const nextIndex = (audioState.currentIndex + 1) % stations.length;
    const nextStation = stations[nextIndex];
    if (nextStation) {
      play(nextStation);
    }
  };

  const previous = () => {
    if (stations.length === 0) return;

    const newIndex =
      audioState.currentIndex <= 0
        ? stations.length - 1
        : audioState.currentIndex - 1;
    const prevStation = stations[newIndex];
    if (prevStation) {
      play(prevStation);
    }
  };

  const setVolume = (volume: number) => {
    setAudioState((prev) => ({
      ...prev,
      volume: Math.max(0, Math.min(100, volume)),
    }));
  };

  const toggleMute = () => {
    setAudioState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  return (
    <AudioContext.Provider
      value={{
        ...audioState,
        stations,
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
