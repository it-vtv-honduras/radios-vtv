"use client"
import { useEffect } from "react"

export default function AdSenseTest() {
  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (e) {
      console.error("Adsense test error", e)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        🔍 Bloque de prueba AdSense
      </h2>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "250px", width: "100%" }}
        // data-ad-client="ca-pub-3940256099942544" // ID DEMO oficial de Google
        data-ad-client="ca-pub-4210489377880865" // ID oficial de la web
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        (Modo de prueba: no se muestran anuncios reales)
      </p>
    </div>
  )
}