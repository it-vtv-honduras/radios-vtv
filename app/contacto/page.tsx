"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Footer } from "@/components/footer";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import type { ContactForm } from "@/lib/types";

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Asegurar scroll al top al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Contacto
        </h1>
        <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="w-full">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Teléfono
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +504 2235-7481
                    </p>
                  </div>
                </div>

              {/*  <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Correo Electrónico
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      info@corpocentro.com
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      contacto@radiostream.com
                    </p>
                  </div>
                </div>*/}

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Dirección
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Colonia El Trapiche, contiguo a Mudanzas Internacionales
                      <br />
                      Tegucigalpa, Honduras
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios de atención */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Horarios de Atención
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sábados y Domingos:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            {/* <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Envíanos un Mensaje
              </h2>

              {submitted ? (
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                  <div className="text-green-600 dark:text-green-400 mb-2">
                    <Send className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">¡Mensaje Enviado!</h3>
                    <p className="text-sm mt-2">
                      Gracias por contactarnos. Te responderemos pronto.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                    >
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                    >
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                    >
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>*/}
          </div>

          <div className="w-full">
           
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
              
              <h3 className="flex justify-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
               <MapPin className="h-8 w-8 text-primary" /> CORPOCENTRO
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.9207573203985!2d-87.16724972543585!3d14.081854989567562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6fbccae0877a15%3A0xcfd773539b3dd30f!2sVTV%20HONDURAS!5e0!3m2!1ses!2shn!4v1751223512253!5m2!1ses!2shn"
                  className="w-full h-50 md:h-96 rounded-lg"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
