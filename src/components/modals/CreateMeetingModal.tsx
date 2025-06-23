"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Plus, MapPin, Video, X, User, Building } from "lucide-react"

interface CreateMeetingModalProps {
  onMeetingCreated?: (meeting: any) => void
}

interface Participant {
  id: string
  name: string
  type: "person" | "company"
  department: string
  email?: string
}

export default function CreateMeetingModal({ onMeetingCreated }: CreateMeetingModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [participantInput, setParticipantInput] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Participant[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const participantInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "60",
    location: "",
    meetingType: "presencial",
    videoLink: "",
    description: "",
    priority: "medium",
    reminder: "15",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Predefined participants database
  const participantsDatabase: Participant[] = [
    {
      id: "1",
      name: "Filipe Oliveira",
      type: "person",
      department: "Engenharia",
      email: "filipe.oliveira@antonelly.com",
    },
    { id: "2", name: "João Silva", type: "person", department: "Construção", email: "joao.silva@antonelly.com" },
    {
      id: "3",
      name: "Maria Santos",
      type: "person",
      department: "Engenharia Civil",
      email: "maria.santos@antonelly.com",
    },
    { id: "4", name: "Carlos Silva", type: "person", department: "Engenharia", email: "carlos.silva@antonelly.com" },
    { id: "5", name: "Ana Clara", type: "person", department: "Administração", email: "ana.clara@antonelly.com" },
    { id: "6", name: "Pedro Costa", type: "person", department: "Qualidade", email: "pedro.costa@antonelly.com" },
    {
      id: "7",
      name: "Lucia Fernandes",
      type: "person",
      department: "Recursos Humanos",
      email: "lucia.fernandes@antonelly.com",
    },
    { id: "8", name: "Roberto Alves", type: "person", department: "Financeiro", email: "roberto.alves@antonelly.com" },
    { id: "9", name: "Empresa ABC Ltda", type: "company", department: "Cliente", email: "contato@empresaabc.com" },
    {
      id: "10",
      name: "Construtora XYZ",
      type: "company",
      department: "Parceiro",
      email: "parceria@construtoraXYZ.com",
    },
    { id: "11", name: "Fornecedor 123", type: "company", department: "Fornecedor", email: "vendas@fornecedor123.com" },
    { id: "12", name: "Consultoria Tech", type: "company", department: "Consultor", email: "info@consultoriatech.com" },
  ]

  const durations = [
    { value: "15", label: "15 minutos" },
    { value: "30", label: "30 minutos" },
    { value: "45", label: "45 minutos" },
    { value: "60", label: "1 hora" },
    { value: "90", label: "1h 30min" },
    { value: "120", label: "2 horas" },
    { value: "180", label: "3 horas" },
  ]

  const priorities = [
    { value: "low", label: "Baixa", color: "text-green-400" },
    { value: "medium", label: "Média", color: "text-yellow-400" },
    { value: "high", label: "Alta", color: "text-orange-400" },
    { value: "urgent", label: "Urgente", color: "text-red-400" },
  ]

  const reminderOptions = [
    { value: "0", label: "Sem lembrete" },
    { value: "5", label: "5 minutos antes" },
    { value: "15", label: "15 minutos antes" },
    { value: "30", label: "30 minutos antes" },
    { value: "60", label: "1 hora antes" },
    { value: "1440", label: "1 dia antes" },
  ]

  // Handle participant input changes and filtering
  useEffect(() => {
    if (participantInput.trim()) {
      const filtered = participantsDatabase.filter(
        (participant) =>
          participant.name.toLowerCase().includes(participantInput.toLowerCase()) &&
          !selectedParticipants.some((selected) => selected.id === participant.id),
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setActiveSuggestionIndex(-1)
    } else {
      setShowSuggestions(false)
      setFilteredSuggestions([])
    }
  }, [participantInput, selectedParticipants])

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (activeSuggestionIndex >= 0) {
          selectParticipant(filteredSuggestions[activeSuggestionIndex])
        } else if (participantInput.trim()) {
          // Add as new participant if no suggestion is selected
          addNewParticipant(participantInput.trim())
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        break
    }
  }

  const selectParticipant = (participant: Participant) => {
    setSelectedParticipants((prev) => [...prev, participant])
    setParticipantInput("")
    setShowSuggestions(false)
    setActiveSuggestionIndex(-1)
    if (errors.participants) {
      setErrors((prev) => ({ ...prev, participants: "" }))
    }
  }

  const addNewParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: `new-${Date.now()}`,
      name: name,
      type: "person",
      department: "Externo",
    }
    setSelectedParticipants((prev) => [...prev, newParticipant])
    setParticipantInput("")
    setShowSuggestions(false)
    if (errors.participants) {
      setErrors((prev) => ({ ...prev, participants: "" }))
    }
  }

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== participantId))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório"
    if (!formData.date) newErrors.date = "Data é obrigatória"
    if (!formData.time) newErrors.time = "Horário é obrigatório"
    if (selectedParticipants.length === 0) newErrors.participants = "Selecione pelo menos um participante"

    // Validate date is not in the past
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`)
    if (selectedDateTime <= new Date()) {
      newErrors.date = "Data e horário devem ser no futuro"
    }

    if (formData.meetingType === "online" && !formData.videoLink.trim()) {
      newErrors.videoLink = "Link da videoconferência é obrigatório para reuniões online"
    }

    if (formData.meetingType === "presencial" && !formData.location.trim()) {
      newErrors.location = "Local é obrigatório para reuniões presenciais"
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

      const newMeeting = {
        id: Date.now().toString(),
        title: formData.title,
        date: formData.date,
        time: formData.time,
        duration: Number.parseInt(formData.duration),
        location: formData.location,
        meetingType: formData.meetingType,
        videoLink: formData.videoLink,
        description: formData.description,
        priority: formData.priority,
        reminder: Number.parseInt(formData.reminder),
        participants: selectedParticipants,
        createdAt: new Date().toISOString(),
        status: "scheduled",
      }

      onMeetingCreated?.(newMeeting)

      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        duration: "60",
        location: "",
        meetingType: "presencial",
        videoLink: "",
        description: "",
        priority: "medium",
        reminder: "15",
      })
      setSelectedParticipants([])
      setParticipantInput("")
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error creating meeting:", error)
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

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Agendar Reunião</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-400" />
            Agendar Nova Reunião
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Assunto da Reunião *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Ex: Reunião sobre Projeto X"
            />
            {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-300">
                Data *
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={getTomorrowDate()}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-300">
                Horário *
              </Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.time && <p className="text-red-400 text-sm">{errors.time}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-300">
                Duração
              </Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value} className="text-white hover:bg-gray-600">
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Participants with Auto-suggest */}
          <div className="space-y-3">
            <Label className="text-gray-300">
              Participantes *
              <span className="text-sm text-gray-500 ml-2">
                ({selectedParticipants.length} selecionado{selectedParticipants.length !== 1 ? "s" : ""})
              </span>
            </Label>

            {/* Selected Participants */}
            {selectedParticipants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    <span className="mr-2">
                      {participant.type === "company" ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    </span>
                    <span>{participant.name}</span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="ml-2 text-blue-400 hover:text-blue-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Participant Input with Auto-suggest */}
            <div className="relative">
              <Input
                ref={participantInputRef}
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => participantInput.trim() && setShowSuggestions(filteredSuggestions.length > 0)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Digite o nome do participante ou empresa..."
              />

              {/* Auto-suggest Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredSuggestions.map((participant, index) => (
                    <button
                      key={participant.id}
                      type="button"
                      onClick={() => selectParticipant(participant)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors ${
                        index === activeSuggestionIndex ? "bg-gray-600" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {participant.type === "company" ? (
                            <Building className="h-4 w-4 text-blue-400" />
                          ) : (
                            <User className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{participant.name}</p>
                          <p className="text-gray-400 text-xs truncate">{participant.department}</p>
                          {participant.email && <p className="text-gray-500 text-xs truncate">{participant.email}</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400">
              Digite para buscar participantes existentes ou pressione Enter para adicionar um novo participante
            </p>
            {errors.participants && <p className="text-red-400 text-sm">{errors.participants}</p>}
          </div>

          {/* Meeting Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingType" className="text-gray-300">
                Tipo de Reunião
              </Label>
              <Select value={formData.meetingType} onValueChange={(value) => handleInputChange("meetingType", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="presencial" className="text-white hover:bg-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Presencial
                    </div>
                  </SelectItem>
                  <SelectItem value="online" className="text-white hover:bg-gray-600">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Online
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Prioridade
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value} className="text-white hover:bg-gray-600">
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location or Video Link */}
          {formData.meetingType === "presencial" ? (
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">
                Local da Reunião *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: Sala de Reuniões A, Escritório Central"
              />
              {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="videoLink" className="text-gray-300">
                Link da Videoconferência *
              </Label>
              <Input
                id="videoLink"
                value={formData.videoLink}
                onChange={(e) => handleInputChange("videoLink", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ex: https://meet.google.com/abc-defg-hij"
              />
              {errors.videoLink && <p className="text-red-400 text-sm">{errors.videoLink}</p>}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Adicione detalhes sobre a reunião, agenda, documentos necessários, etc."
              rows={3}
            />
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <Label htmlFor="reminder" className="text-gray-300">
              Lembrete
            </Label>
            <Select value={formData.reminder} onValueChange={(value) => handleInputChange("reminder", value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {reminderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-600">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {(formData.title || formData.date || formData.time) && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3">Pré-visualização da Reunião</h4>
              <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                  <h5 className="text-white font-semibold">{formData.title || "Título da reunião"}</h5>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  {formData.date && formData.time && (
                    <p>
                      📅 {new Date(formData.date).toLocaleDateString("pt-BR")} às {formData.time}
                    </p>
                  )}
                  {formData.duration && <p>⏱️ Duração: {durations.find((d) => d.value === formData.duration)?.label}</p>}
                  {selectedParticipants.length > 0 && (
                    <p>👥 Participantes: {selectedParticipants.map((p) => p.name).join(", ")}</p>
                  )}
                  {formData.meetingType === "presencial" && formData.location && <p>📍 Local: {formData.location}</p>}
                  {formData.meetingType === "online" && formData.videoLink && <p>🔗 Online</p>}
                </div>
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
              {isLoading ? "Agendando..." : "Agendar Reunião"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
