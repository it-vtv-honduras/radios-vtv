// next-config.mjs
import { stations } from './next-stations.mjs';

/** normaliza texto a slug simple (sin tildes, minúsculas, con guiones) */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.3:3000",
  ],

  async redirects() {
    const rules = [];

    for (const s of stations) {
      rules.push({
        source: `/${s.slug}`,
        destination: `/estacion/${s.id}`,
        permanent: true,
      });

      for (const syn of s.synonyms) {
        const alias = normalize(syn);

        rules.push({
          source: `/${alias}`,
          destination: `/estacion/${s.id}`,
          permanent: true,
        });

        rules.push({
          source: `/escuchar/${alias}-radio`,
          destination: `/estacion/${s.id}`,
          permanent: true,
        });

        rules.push({
          source: `/radio/${alias}-en-vivo`,
          destination: `/estacion/${s.id}`,
          permanent: true,
        });
      }
    }

    const accion = stations.find((x) => x.slug === "accion-radio")?.id || "";
    const mia    = stations.find((x) => x.slug === "mia-fm")?.id || "";
    if (accion) {
      rules.push(
        { source: "/accion", destination: `/estacion/${accion}`, permanent: true },
        { source: "/acción", destination: `/estacion/${accion}`, permanent: true }
      );
    }
    if (mia) {
      rules.push(
        { source: "/mia", destination: `/estacion/${mia}`, permanent: true },
        { source: "/mía", destination: `/estacion/${mia}`, permanent: true }
      );
    }

    return rules;
  },
};

export default nextConfig;
