"use client";

import { useEffect } from "react";
import { RadioStationGrid } from "@/components/radio-station-grid";
import { FeaturedStation } from "@/components/featured-station";
import { Footer } from "@/components/footer";
import type { Station } from "@/lib/types";
import { useAudio } from "@/components/audio-provider";
import { AdBanner, AdMultiplex } from "@/components/ad-banner";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

interface HomePageProps {
  initialStations: Station[];
}

export function HomePage({ initialStations }: HomePageProps) {
  const { setStations } = useAudio();

  useEffect(() => {
    // Cargar las estaciones en el contexto de audio
    setStations(initialStations);
  }, [initialStations, setStations]);

  // Página sin estaciones: muestra contenido editorial (sin anuncios)
  if (!initialStations.length) {
    return (
      <>
        <main className="container mx-auto px-4 py-8 md:pb-32">
          <h1 className="text-3xl font-bold text-center mb-6">
            Radios Grupo VTV - Emisoras en Vivo de Honduras
          </h1>
          <p className="mx-auto max-w-2xl text-center text-gray-700 dark:text-gray-300">
            Bienvenido a la plataforma oficial de radios de Grupo VTV. Estamos
            actualizando nuestra lista de emisoras. Mientras tanto, descubre
            nuestra programación, géneros musicales y cobertura a nivel
            nacional. Vuelve en unos minutos para escuchar en vivo.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // Con contenido real: ahora sí podemos mostrar anuncios
  const featuredStation = initialStations[0];
  const canShowAds = initialStations.length > 0;

  // Calcular estadísticas para contenido rico
  const totalStations = initialStations.length;
  const genres = Array.from(new Set(initialStations.map(s => s.genre).filter(Boolean)));
  const locations = Array.from(new Set(initialStations.map(s => s.location).filter(Boolean)));

  return (
    <>
      <main className="container mx-auto px-4 py-8 md:pb-32">
        {/* Hero Section con keywords */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Escucha Radios en Vivo de Honduras - Grupo VTV
          </h1>
          <p className="mx-auto max-w-2xl text-center mb-4 text-gray-700 dark:text-gray-300">
            Transmisión en vivo de las mejores emisoras de radio de Honduras. 
            Escucha gratis tus estaciones favoritas en línea, sin interrupciones y con la mejor calidad de audio.
          </p>
          
          {/* Información adicional para SEO */}
          <div className="mx-auto max-w-2xl text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <p>
              <strong>{totalStations} emisoras</strong> disponibles | 
              <strong> Variedad de géneros musicales</strong> | 
              Cobertura a nivel <strong>mundial</strong>
            </p>
          </div>
        </header>

        {/* Estación destacada */}
        {featuredStation && (
          <section className="mb-10 w-full lg:w-1/2 md:w-3/4 mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white  sm:text-left text-center">
              Radio Destacada: {featuredStation.name} en Vivo
            </h2>
            <FeaturedStation station={featuredStation} />
            
            {/* Descripción breve de la estación destacada */}
            {featuredStation.description && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center ">
                {featuredStation.description.slice(0, 150)}...
              </p>
            )}
          </section>
        )}

        {/* Banner superior*/}
        {canShowAds && (
          <div className="mt-8 mb-8 pt-8 w-full md:w-4/6 mx-auto">
            <AdBanner
              adSlot="8671563719"
              adFormat="auto"
              className="text-center"
            />
          </div>
        )}

        {/* Grid de todas las estaciones */}
        <section className="mb-16 w-full md:w-4/6 mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
            Todas las Emisoras de Radio en Vivo
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Selecciona tu estación favorita y comienza a escuchar transmisión en vivo ahora mismo. 
            Todas las radios están disponibles gratis y sin interrupciones.
          </p>
          <RadioStationGrid stations={initialStations} />
        </section>

        {/* Banner inferior (MULTIPLEX) */}
        {canShowAds && (
          <AdMultiplex
            adSlot="3605147280"
            className="w-full md:w-4/6 mx-auto my-10"
          />
        )}

        {/* Footer informativo */}
        <section className="w-full md:w-4/6 mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>Grupo VTV</strong> - Líder en transmisión de radio en línea en Honduras
          </p>
          <p>
            Escucha las mejores emisoras FM de Tegucigalpa, San Pedro Sula y todo Honduras. 
            Streaming de alta calidad disponible gratis para todo el mundo.
          </p>
        </section>

        
      {/* Secciones en Accordion - Grid de 2 columnas */}
        <section className="mt-12 w-full md:w-4/6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Columna 1: ¿Por qué escuchar con Grupo VTV? */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <Accordion>
                <AccordionItem 
                  title="¿Por qué escuchar radio en línea con Grupo VTV?"
                  defaultOpen={true}
                >
                  <div className="space-y-6 text-left">
                    <div className="pt-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Transmisión en vivo gratuita 24/7
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Grupo VTV ofrece la mejor experiencia para <strong>escuchar radio en vivo de Honduras</strong> directamente 
                        desde tu navegador. Nuestra plataforma te permite disfrutar de <strong>transmisión en línea gratuita</strong> de 
                        las emisoras más populares del país, sin necesidad de descargas ni registro.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Variedad de géneros musicales
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Accede a contenido de <strong>música tropical, banda, rancheras, pop en español, urbano y más</strong>. 
                        Cada emisora está especializada en un género específico para satisfacer todos los gustos musicales. 
                        Desde los ritmos más calientes hasta los clásicos románticos, encuentra la estación perfecta 
                        para cada momento de tu día.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Calidad de audio superior
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Todas nuestras estaciones transmiten con la <strong>mejor calidad de audio</strong> disponible. 
                        Optimizamos cada stream para garantizar una experiencia de escucha clara y sin interrupciones, 
                        compatible con cualquier dispositivo: computadora, tablet o smartphone.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Acceso desde cualquier dispositivo
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Nuestra plataforma es <strong>100% responsive</strong> y funciona perfectamente en todos los dispositivos. 
                        Solo necesitas un navegador web y conexión a internet. Sin aplicaciones que ocupen espacio 
                        en tu dispositivo, sin actualizaciones molestas.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Sin interrupciones ni cortes
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Utilizamos la mejor tecnología de streaming para garantizar una <strong>transmisión continua sin cortes</strong>. 
                        Nuestros servidores están optimizados para mantener el audio fluyendo sin interrupciones, 
                        incluso en conexiones de internet moderadas.
                      </p>
                    </div>

                    {/* Géneros disponibles */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Géneros musicales disponibles
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <span 
                            key={genre}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Columna 2: Preguntas Frecuentes */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <Accordion>
                <AccordionItem 
                  title="Preguntas Frecuentes sobre Radio en Línea"
                  defaultOpen={true}
                >
                  <div className="space-y-6 text-left">
                    <div className="pt-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Cómo escuchar radio en vivo en Honduras?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Para escuchar radio en vivo simplemente haz clic en el botón <strong>"Reproducir"</strong> de cualquier 
                        emisora. No necesitas descargar ninguna aplicación ni registrarte. La transmisión comienza 
                        instantáneamente en tu navegador. Puedes controlar el volumen, pausar o cambiar de estación 
                        en cualquier momento.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Es gratis escuchar las radios de Grupo VTV?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Sí, todas nuestras emisoras son <strong>completamente gratuitas</strong>. No cobramos 
                        suscripciones ni requerimos registro. Solo necesitas conexión a internet para 
                        disfrutar de la transmisión en vivo. Nunca te pediremos información de tarjeta de crédito 
                        ni datos personales para escuchar.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Qué géneros de música puedo escuchar?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                        Ofrecemos una amplia variedad de géneros:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2">
                        <li><strong>Música tropical</strong> - Salsa, merengue, cumbia</li>
                        <li><strong>Banda y rancheras</strong> - Regional mexicano</li>
                        <li><strong>Pop en español</strong> - Los éxitos del momento</li>
                        <li><strong>Urbano</strong> - Reggaeton, trap, dembow</li>
                        <li><strong>Adulto contemporáneo</strong> - Clásicos en inglés</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Puedo escuchar desde mi celular?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Por supuesto. Nuestra plataforma está optimizada para funcionar en cualquier 
                        dispositivo: <strong>computadoras, tablets y teléfonos móviles</strong>. Solo abre tu 
                        navegador favorito (Chrome, Safari, Firefox, Edge) y visita nuestro sitio. No necesitas 
                        instalar ninguna app, aunque puedes agregar un acceso directo a tu pantalla de inicio.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Las radios transmiten las 24 horas?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Sí, todas nuestras emisoras transmiten <strong>24 horas al día, 7 días a la semana</strong>. 
                        Puedes sintonizar tu estación favorita en cualquier momento del día o la noche. Cada estación 
                        tiene programación especial en diferentes horarios, con locutores en vivo y contenido exclusivo.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Necesito registrarme o crear una cuenta?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        No, no necesitas registrarte ni crear una cuenta para escuchar. Nuestro servicio es 
                        <strong> completamente público y gratuito</strong>. Simplemente entra al sitio y comienza 
                        a escuchar de inmediato. Sin barreras, sin complicaciones.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        ¿Qué hago si el audio no se reproduce?
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                        Si experimentas problemas para reproducir el audio, prueba estos pasos:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2">
                        <li>Verifica que tu conexión a internet esté funcionando</li>
                        <li>Asegúrate de que el volumen no esté silenciado</li>
                        <li>Intenta refrescar la página (F5)</li>
                        <li>Prueba con otra estación para descartar problemas temporales</li>
                        <li>Si usas bloqueadores de anuncios, agréganos a la lista blanca</li>
                      </ol>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}