export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  avatar?: string
}

export type UserRole = "admin" | "manager" | "engineer" | "worker"

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete"
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: "users", action: "create" },
    { resource: "users", action: "read" },
    { resource: "users", action: "update" },
    { resource: "users", action: "delete" },
    { resource: "notices", action: "create" },
    { resource: "notices", action: "read" },
    { resource: "notices", action: "update" },
    { resource: "notices", action: "delete" },
    { resource: "procedures", action: "create" },
    { resource: "procedures", action: "read" },
    { resource: "procedures", action: "update" },
    { resource: "procedures", action: "delete" },
    { resource: "notifications", action: "create" },
    { resource: "notifications", action: "read" },
    { resource: "notifications", action: "update" },
    { resource: "notifications", action: "delete" },
  ],
  manager: [
    { resource: "notices", action: "create" },
    { resource: "notices", action: "read" },
    { resource: "notices", action: "update" },
    { resource: "procedures", action: "create" },
    { resource: "procedures", action: "read" },
    { resource: "procedures", action: "update" },
    { resource: "notifications", action: "create" },
    { resource: "notifications", action: "read" },
  ],
  engineer: [
    { resource: "notices", action: "read" },
    { resource: "procedures", action: "read" },
    { resource: "procedures", action: "create" },
    { resource: "notifications", action: "read" },
  ],
  worker: [
    { resource: "notices", action: "read" },
    { resource: "procedures", action: "read" },
    { resource: "notifications", action: "read" },
  ],
}
