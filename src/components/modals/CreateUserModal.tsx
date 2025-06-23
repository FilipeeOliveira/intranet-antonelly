"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Plus, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/types/auth"

interface CreateUserModalProps {
  onUserCreated?: (user: any) => void
}

export default function CreateUserModal({ onUserCreated }: CreateUserModalProps) {
  const { user: currentUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    department: "",
    phone: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const departments = [
    "Administração",
    "Engenharia",
    "Engenharia Civil",
    "Construção",
    "Recursos Humanos",
    "Financeiro",
    "Compras",
    "Qualidade",
  ]

  const roles = [
    { value: "worker", label: "Trabalhador(a)" },
    { value: "engineer", label: "Engenheiro(a)" },
    { value: "manager", label: "Gerente" },
    { value: "admin", label: "Administrador" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    if (!formData.password) newErrors.password = "Senha é obrigatória"
    if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }
    if (!formData.role) newErrors.role = "Função é obrigatória"
    if (!formData.department.trim()) newErrors.department = "Departamento é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
        avatar: formData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.name,
      }

      onUserCreated?.(newUser)

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        phone: "",
        notes: "",
      })
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Novo Usuário</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-blue-400" />
            Criar Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Nome Completo *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Digite o nome completo"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="usuario@antonelly.com"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Senha *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirmar Senha *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Confirme a senha"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Role and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">
                Função *
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-white hover:bg-gray-600">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-300">
                Departamento *
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-white hover:bg-gray-600">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-red-400 text-sm">{errors.department}</p>}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              Telefone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Informações adicionais sobre o usuário"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Criando..." : "Criar Usuário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
