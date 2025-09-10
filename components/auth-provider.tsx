"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  login as authLogin,
  logout as authLogout,
  forgotPassword as authForgotPassword,
  checkActiveSession as authCheckActiveSession,
} from "@/lib/auth" // Ajusta la ruta si es necesario
import type { AdminUser } from "@/lib/types"

type AuthContextType = {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ authenticated: boolean }>
  logout: () => Promise<{ success: boolean }>
  forgotPassword: (email: string) => Promise<void>
  checkActiveSession: () => Promise<{ uid: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación al cargar
    const checkSession = async () => {
      const session = await authCheckActiveSession()
      if (session?.uid) {
        setUser({  email: session.email, password: "", role: "admin" }) // Ajusta los valores según corresponda
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await authLogin(email, password)
    if (result?.authenticated) {
      setUser({ email, password: "", role: "admin" })
    }
    return result
  }

  const logout = async () => {
    const result = await authLogout()
    setUser(null)
    return result
  }

  const forgotPassword = async (email: string) => {
    await authForgotPassword(email)
  }

  const checkActiveSession = async () => {
    return await authCheckActiveSession()
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, forgotPassword, checkActiveSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}