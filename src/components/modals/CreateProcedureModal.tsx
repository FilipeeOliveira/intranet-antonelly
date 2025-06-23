"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, File } from "lucide-react"

interface CreateProcedureModalProps {
  onProcedureCreated?: (procedure: any) => void
}

export default function CreateProcedureModal({ onProcedureCreated }: CreateProcedureModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "",
    department: "",
    version: "1.0",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    "Segurança no Trabalho",
    "Qualidade",
    "Meio Ambiente",
    "Operacional",
    "Administrativo",
    "Recursos Humanos",
    "Financeiro",
    "Compras",
  ]

  const priorities = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
  ]

  const departments = [
    "Todos os Departamentos",
    "Administração",
    "Engenharia",
    "Construção",
    "Qualidade",
    "Segurança",
    "Recursos Humanos",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.category) newErrors.category = "Categoria é obrigatória"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (!formData.priority) newErrors.priority = "Prioridade é obrigatória"
    if (!formData.department) newErrors.department = "Departamento é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      alert("Apenas arquivos PDF são permitidos")
      return
    }

    setUploadedFiles((prev) => [...prev, ...pdfFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newProcedure = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        department: formData.department,
        version: formData.version,
        files: uploadedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        createdAt: new Date().toISOString(),
        status: "active",
      }

      onProcedureCreated?.(newProcedure)

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        priority: "",
        department: "",
        version: "1.0",
      })
      setUploadedFiles([])
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error creating procedure:", error)
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
          <Upload className="h-5 w-5" />
          <span>Upload PDF</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-400" />
            Criar Novo Procedimento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Título do Procedimento *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: Procedimento de Segurança em Altura"
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
              placeholder="Descreva o procedimento e sua aplicação"
              rows={4}
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
          </div>

          {/* Priority, Department, and Version */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Prioridade *
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value} className="text-white hover:bg-gray-600">
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-red-400 text-sm">{errors.priority}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-300">
                Departamento *
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione" />
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

            <div className="space-y-2">
              <Label htmlFor="version" className="text-gray-300">
                Versão
              </Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => handleInputChange("version", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="1.0"
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Documentos PDF</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                Adicionar PDF
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Arquivos selecionados:</p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{file.name}</p>
                          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {isLoading ? "Criando..." : "Criar Procedimento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
