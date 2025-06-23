"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Clock, Plus } from "lucide-react"

interface CreateAlertModalProps {
  onAlertCreated?: (alert: { title: string; description: string }) => void
}

export default function CreateAlertModal({ onAlertCreated }: CreateAlertModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    affectedAreas: "",
    actionRequired: "",
    contactPerson: "",
    contactPhone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const severities = [
    { value: "info", label: "Informativo", color: "text-blue-400", bgColor: "bg-blue-500/20" },
    { value: "warning", label: "Atenção", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
    { value: "critical", label: "Crítico", color: "text-red-400", bgColor: "bg-red-500/20" },
    { value: "emergency", label: "Emergência", color: "text-red-600", bgColor: "bg-red-600/20" },
  ]

  const categories = [
    "Segurança",
    "Manutenção",
    "Clima/Tempo",
    "Equipamentos",
    "Acesso",
    "Qualidade",
    "Meio Ambiente",
    "Recursos Humanos",
    "Outros",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (!formData.severity) newErrors.severity = "Severidade é obrigatória"
    if (!formData.category) newErrors.category = "Categoria é obrigatória"
    if (!formData.startDate) newErrors.startDate = "Data de início é obrigatória"

    // Validate date range
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "Data de fim deve ser posterior à data de início"
      }
    }

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

      const newAlert = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        category: formData.category,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        affectedAreas: formData.affectedAreas,
        actionRequired: formData.actionRequired,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        createdAt: new Date().toISOString(),
        status: "active",
        acknowledgedBy: [],
      }

      onAlertCreated?.(newAlert)

      // Reset form
      setFormData({
        title: "",
        description: "",
        severity: "",
        category: "",
        location: "",
        startDate: "",
        endDate: "",
        affectedAreas: "",
        actionRequired: "",
        contactPerson: "",
        contactPhone: "",
      })
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error creating alert:", error)
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

  const getCurrentDateTime = () => {
    const now = new Date()
    return now.toISOString().slice(0, 16)
  }

  const selectedSeverity = severities.find((s) => s.value === formData.severity)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Novo Aviso</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
            Criar Novo Alerta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Título do Alerta *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: Interdição temporária - Obra B"
              />
              {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">
                Categoria *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-600">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Descreva detalhadamente o alerta e suas implicações"
              rows={4}
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          {/* Severity and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity" className="text-gray-300">
                Severidade *
              </Label>
              <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {severities.map((severity) => (
                    <SelectItem key={severity.value} value={severity.value} className="text-white hover:bg-gray-600">
                      <span className={severity.color}>{severity.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && <p className="text-red-400 text-sm">{errors.severity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">
                Local/Área
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: Canteiro de obras B, Setor 3"
              />
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-300">
                Data/Hora de Início *
              </Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  min={getCurrentDateTime()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && <p className="text-red-400 text-sm">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-300">
                Data/Hora de Fim (Opcional)
              </Label>
              <div className="relative">
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  min={formData.startDate || getCurrentDateTime()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.endDate && <p className="text-red-400 text-sm">{errors.endDate}</p>}
            </div>
          </div>

          {/* Affected Areas */}
          <div className="space-y-2">
            <Label htmlFor="affectedAreas" className="text-gray-300">
              Áreas Afetadas
            </Label>
            <Input
              id="affectedAreas"
              value={formData.affectedAreas}
              onChange={(e) => handleInputChange("affectedAreas", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ex: Acesso principal, Estacionamento, Refeitório"
            />
          </div>

          {/* Action Required */}
          <div className="space-y-2">
            <Label htmlFor="actionRequired" className="text-gray-300">
              Ação Necessária
            </Label>
            <Textarea
              id="actionRequired"
              value={formData.actionRequired}
              onChange={(e) => handleInputChange("actionRequired", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Descreva as ações que devem ser tomadas pelos funcionários"
              rows={3}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-gray-300">
                Pessoa de Contato
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-gray-300">
                Telefone de Contato
              </Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Preview */}
          {(formData.title || formData.description) && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Pré-visualização do Alerta</h4>
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  selectedSeverity
                    ? `${selectedSeverity.bgColor} border-${selectedSeverity.value === "info" ? "blue" : selectedSeverity.value === "warning" ? "yellow" : "red"}-500`
                    : "bg-gray-600 border-gray-500"
                }`}
              >
                <div className="flex items-center mb-2">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${selectedSeverity?.color || "text-gray-400"}`} />
                  <h5 className="text-white font-semibold">{formData.title || "Título do alerta"}</h5>
                </div>
                <p className="text-gray-200 text-sm mb-2">{formData.description || "Descrição do alerta"}</p>
                {formData.location && <p className="text-gray-300 text-xs">📍 {formData.location}</p>}
                {selectedSeverity && (
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${selectedSeverity.color} bg-gray-800`}
                  >
                    {selectedSeverity.label}
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
              {isLoading ? "Criando..." : "Criar Alerta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
