"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  fullWidthResponsive?: boolean
  className?: string
}

export function AdBanner({ adSlot, adFormat = "auto", fullWidthResponsive = true, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cargar Google AdSense cuando esté disponible
    if (typeof window !== "undefined" && (window as any).adsbygoogle) {
      try {
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.error("Error loading ad:", error)
      }
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4210489377880865"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}

// Componente para anuncios intersticiales
export function AdInterstitial({ adSlot, onClose }: { adSlot: string; onClose: () => void }) {
  useEffect(() => {
    // Lógica para mostrar anuncio intersticial
    const timer = setTimeout(() => {
      onClose()
    }, 5000) // Auto-cerrar después de 5 segundos

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Publicidad</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-4210489377880865"
              data-ad-slot={adSlot}
              data-ad-format="auto"
            />
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg">
          Continuar
        </button>
      </div>
    </div>
  )
}

// Componente para anuncios nativos
export function AdNative({ adSlot, className = "" }: { adSlot: string; className?: string }) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (e) {
      console.error("Adsense error", e)
    }
  }, [])

  return (
    <div className={`ad-native ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-4210489377880865"
        data-ad-slot={adSlot}
      />
    </div>
  )
}
