// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.radiosgrupovtv.com";

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
