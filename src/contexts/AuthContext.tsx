"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Ana Clara",
    email: "ana.clara@antonelly.com",
    password: "admin123",
    role: "admin",
    department: "Administração",
    avatar: "AC",
  },
  {
    id: "2",
    name: "Carlos Silva",
    email: "carlos.silva@antonelly.com",
    password: "manager123",
    role: "manager",
    department: "Engenharia",
    avatar: "CS",
  },
  {
    id: "3",
    name: "Maria Santos",
    email: "maria.santos@antonelly.com",
    password: "engineer123",
    role: "engineer",
    department: "Engenharia Civil",
    avatar: "MS",
  },
  {
    id: "4",
    name: "João Pereira",
    email: "joao.pereira@antonelly.com",
    password: "worker123",
    role: "worker",
    department: "Construção",
    avatar: "JP",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("antonelly_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("antonelly_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("antonelly_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("antonelly_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
