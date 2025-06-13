import type { UserRole } from "@/types/auth"

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

const roleConfig = {
  admin: { label: "Administrador", color: "bg-red-500 text-white" },
  manager: { label: "Gerente", color: "bg-blue-500 text-white" },
  engineer: { label: "Engenheiro(a)", color: "bg-green-500 text-white" },
  worker: { label: "Trabalhador(a)", color: "bg-gray-500 text-white" },
}

export default function RoleBadge({ role, className = "" }: RoleBadgeProps) {
  const config = roleConfig[role]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      {config.label}
    </span>
  )
}
