"use client"

import Link from "next/link"
import { Radio, Menu, X, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "./auth-provider"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Radio className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">Radios Grupo VTV</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
           
            <Link
              href="/contacto"
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              Contacto
            </Link>
            {user && (
              <>
                <Link
                  href="/admin"
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Settings size={16} />
                  Panel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </>
            )}
            <ThemeToggle />
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/contacto"
                className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              {user && (
                <>
                  <Link
                    href="/admin"
                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Panel Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-1 text-left"
                  >
                    <LogOut size={16} />
                    Salir
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}