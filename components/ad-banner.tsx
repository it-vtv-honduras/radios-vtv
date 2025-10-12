"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal" | "autorelaxed";
  fullWidthResponsive?: boolean;
  className?: string;
}

export function AdBanner({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ins = wrapperRef.current?.querySelector("ins.adsbygoogle") as HTMLElement | null;
    const alreadyLoaded = ins?.getAttribute("data-adsbygoogle-status") === "done";
    try {
      if (!alreadyLoaded && typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("Error loading ad:", error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} ref={wrapperRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4210489377880865"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Nativo (in-feed / in-article) – requiere layoutKey real de AdSense
export function AdNative({
  adSlot,
  layoutKey = "-6t+ed+2i-1n-4w",
  className = "",
}: {
  adSlot: string;
  layoutKey?: string;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ins = wrapperRef.current?.querySelector("ins.adsbygoogle") as HTMLElement | null;
    const alreadyLoaded = ins?.getAttribute("data-adsbygoogle-status") === "done";
    try {
      if (!alreadyLoaded && typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []);

  return (
    <div className={`ad-native ${className}`} ref={wrapperRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4210489377880865"
        data-ad-slot={adSlot}
        data-ad-format="fluid"
        data-ad-layout-key={layoutKey}
      />
    </div>
  );
}

export function AdMultiplex({
  adSlot,
  className = "",
}: {
  adSlot: string;
  className?: string;
}) {
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat="autorelaxed"
      className={className}
    />
  );
}
