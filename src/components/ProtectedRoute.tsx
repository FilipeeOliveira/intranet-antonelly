"use client"

import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/hooks/usePermissions"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  resource?: string
  action?: "create" | "read" | "update" | "delete"
  fallback?: ReactNode
}

export default function ProtectedRoute({ children, resource, action = "read", fallback }: ProtectedRouteProps) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()

  if (!user) {
    return null
  }

  if (resource && !hasPermission(resource, action)) {
    return (
      fallback || (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
          <p className="font-semibold">Acesso Negado</p>
          <p className="text-sm mt-1">Você não tem permissão para acessar esta funcionalidade.</p>
        </div>
      )
    )
  }

  return <>{children}</>
}
