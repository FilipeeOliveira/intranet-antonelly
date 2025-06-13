"use client"

import { useAuth } from "@/contexts/AuthContext"
import { ROLE_PERMISSIONS } from "@/types/auth"

export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = (resource: string, action: "create" | "read" | "update" | "delete"): boolean => {
    if (!user) return false

    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return userPermissions.some((permission) => permission.resource === resource && permission.action === action)
  }

  const canCreate = (resource: string) => hasPermission(resource, "create")
  const canRead = (resource: string) => hasPermission(resource, "read")
  const canUpdate = (resource: string) => hasPermission(resource, "update")
  const canDelete = (resource: string) => hasPermission(resource, "delete")

  const isAdmin = () => user?.role === "admin"
  const isManager = () => user?.role === "manager" || user?.role === "admin"
  const isEngineer = () => ["engineer", "manager", "admin"].includes(user?.role || "")

  return {
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    isAdmin,
    isManager,
    isEngineer,
    userRole: user?.role,
  }
}
