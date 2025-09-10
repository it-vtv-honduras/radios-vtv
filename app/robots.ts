// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://stream-radios.netlify.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"], // ajusta si necesitas
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
