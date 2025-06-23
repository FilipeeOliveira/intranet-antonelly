"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Bell } from "lucide-react"

interface CreateNotificationModalProps {
  onNotificationCreated?: (notification: { title: string }) => void
}

export default function CreateNotificationModal({ onNotificationCreated }: CreateNotificationModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "",
    targetAudience: "",
    expiryDate: "",
    sendEmail: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const priorities = [
    { value: "low", label: "Baixa", color: "text-green-400" },
    { value: "medium", label: "Média", color: "text-yellow-400" },
    { value: "high", label: "Alta", color: "text-orange-400" },
    { value: "urgent", label: "Urgente", color: "text-red-400" },
  ]

  const audiences = [
    "Todos os Usuários",
    "Apenas Administradores",
    "Gerentes e Administradores",
    "Engenheiros",
    "Trabalhadores de Campo",
    "Departamento Específico",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.message.trim()) newErrors.message = "Mensagem é obrigatória"
    if (!formData.priority) newErrors.priority = "Prioridade é obrigatória"
    if (!formData.targetAudience) newErrors.targetAudience = "Público-alvo é obrigatório"

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

      const newNotification = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        expiryDate: formData.expiryDate || null,
        sendEmail: formData.sendEmail,
        createdAt: new Date().toISOString(),
        status: "active",
        readBy: [],
      }

      onNotificationCreated?.(newNotification)

      // Reset form
      setFormData({
        title: "",
        message: "",
        priority: "",
        targetAudience: "",
        expiryDate: "",
        sendEmail: false,
      })
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error creating notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Nova Notificação</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-400" />
            Criar Nova Notificação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Título da Notificação *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: Manutenção programada do sistema"
              />
              {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Prioridade *
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value} className="text-white hover:bg-gray-600">
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-red-400 text-sm">{errors.priority}</p>}
            </div>
          </div>

          {/* Target Audience and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-gray-300">
                Público-alvo *
              </Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleInputChange("targetAudience", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o público" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {audiences.map((audience) => (
                    <SelectItem key={audience} value={audience} className="text-white hover:bg-gray-600">
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.targetAudience && <p className="text-red-400 text-sm">{errors.targetAudience}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-gray-300">
                Data de Expiração (Opcional)
              </Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  min={getTomorrowDate()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400">Se não definida, a notificação não expirará automaticamente</p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">
              Mensagem *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Digite a mensagem da notificação"
              rows={4}
            />
            {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
          </div>

          {/* Email Notification */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmail"
              checked={formData.sendEmail}
              onChange={(e) => handleInputChange("sendEmail", e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500"
            />
            <Label htmlFor="sendEmail" className="text-gray-300 text-sm">
              Enviar notificação por email
            </Label>
          </div>

          {/* Preview */}
          {(formData.title || formData.message) && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Pré-visualização da Notificação</h4>
              <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                  <Bell className="h-5 w-5 mr-2 text-blue-400" />
                  <h5 className="text-white font-semibold">{formData.title || "Título da notificação"}</h5>
                </div>
                <p className="text-gray-200 text-sm mb-2">{formData.message || "Mensagem da notificação"}</p>
                {formData.priority && (
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                      priorities.find((p) => p.value === formData.priority)?.color || "text-gray-400"
                    } bg-gray-800`}
                  >
                    {priorities.find((p) => p.value === formData.priority)?.label}
                  </span>
                )}
              </div>
            </div>
          )}

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
              {isLoading ? "Criando..." : "Criar Notificação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
