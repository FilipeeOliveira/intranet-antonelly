"use client"

import { useState } from "react"
import { Home, Bell, Info, FileText, Plus, LogOut, ChevronDown, BookOpen, Users, Shield, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/hooks/usePermissions"
import LoginForm from "@/components/LoginForm"
import ProtectedRoute from "@/components/ProtectedRoute"
import RoleBadge from "@/components/RoleBadge"
import CreateUserModal from "@/components/modals/CreateUserModal"
import CreateProcedureModal from "@/components/modals/CreateProcedureModal"
import CreateNotificationModal from "@/components/modals/CreateNotificationModal"
import CreateAlertModal from "@/components/modals/CreateAlertModal"
import CreateMeetingModal from "@/components/modals/CreateMeetingModal"

type Section = "dashboard" | "notificacoes" | "avisos" | "procedimentos" | "cadastros" | "usuarios" | "reunioes"

interface AccordionState {
  [key: string]: boolean
}

export default function IntranetPage() {
  const { user, logout, isLoading } = useAuth()
  const { canCreate, canUpdate, canDelete, isAdmin, isManager } = usePermissions()
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [accordionState, setAccordionState] = useState<AccordionState>({})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const toggleAccordion = (key: string) => {
    setAccordionState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const sectionTitles = {
    dashboard: "Painel de Início",
    notificacoes: "Notificações Importantes",
    avisos: "Avisos da Empresa",
    procedimentos: "Procedimentos Internos",
    cadastros: "Cadastros",
    usuarios: "Gerenciar Usuários",
    reunioes: "Reuniões e Agendamentos",
  }

  const navItems = [
    { id: "dashboard" as Section, icon: Home, label: "Início", permission: null },
    {
      id: "notificacoes" as Section,
      icon: Bell,
      label: "Notificações",
      badge: 3,
      permission: { resource: "notifications", action: "read" as const },
    },
    {
      id: "avisos" as Section,
      icon: Info,
      label: "Avisos da Empresa",
      permission: { resource: "notices", action: "read" as const },
    },
    {
      id: "procedimentos" as Section,
      icon: FileText,
      label: "Procedimentos",
      permission: { resource: "procedures", action: "read" as const },
    },
    {
      id: "reunioes" as Section,
      icon: Calendar,
      label: "Reuniões",
      permission: null, // Everyone can access meetings
    },
    {
      id: "cadastros" as Section,
      icon: Plus,
      label: "Cadastros",
      permission: { resource: "notices", action: "create" as const },
    },
    {
      id: "usuarios" as Section,
      icon: Users,
      label: "Usuários",
      permission: { resource: "users", action: "read" as const },
    },
  ]

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black text-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center bg-gray-900 border-b border-gray-800">
          <h1 className="text-xl font-bold text-amber-400 cursor-default">
            Antonelly<span className="text-white">Construções</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const hasAccess =
              !item.permission ||
              (item.permission.resource === "notifications" && true) || // Everyone can see notifications
              (item.permission.resource === "notices" && true) || // Everyone can see notices
              (item.permission.resource === "procedures" && true) || // Everyone can see procedures
              (item.permission.resource === "notices" && (isManager() || canCreate("notices"))) || // Only managers+ can create
              (item.permission.resource === "users" && isAdmin()) // Only admins can manage users

            if (!hasAccess) return null

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-all cursor-pointer hover:transform hover:scale-105 active:transform active:scale-95 ${
                  activeSection === item.id ? "bg-amber-400 text-gray-800 font-semibold" : "text-gray-200"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-amber-400 font-bold cursor-default">
              {user.avatar}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-100 cursor-default">{user.name}</p>
              <p className="text-xs text-gray-500 cursor-default">{user.department}</p>
            </div>
          </div>
          <div className="mb-3">
            <RoleBadge role={user.role} />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-gray-800 cursor-pointer hover:transform hover:scale-105 active:transform active:scale-95"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-bold text-white cursor-default">{sectionTitles[activeSection]}</h2>
            {isAdmin() && (
              <div className="flex items-center mt-1">
                <Shield className="h-4 w-4 text-amber-400 mr-1" />
                <span className="text-sm text-amber-400 cursor-default">Modo Administrador</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 cursor-default">Bem-vindo(a), {user.name}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <div className="md:col-span-2 lg:col-span-3 bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold text-white cursor-default">Bem-vindo(a), {user.name}!</h3>
                <p className="mt-2 text-gray-400 cursor-default">
                  Aqui está um resumo rápido das atividades recentes na empresa. Tenha um ótimo dia de trabalho!
                </p>
                <div className="mt-4">
                  <RoleBadge role={user.role} />
                </div>
              </div>

              {/* Quick Access Cards */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all cursor-pointer hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-700 rounded-full">
                    <Bell className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-200 cursor-default">Notificações Urgentes</h4>
                    <p className="text-2xl font-bold text-white cursor-default">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all cursor-pointer hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-700 rounded-full">
                    <Info className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-200 cursor-default">Avisos Recentes</h4>
                    <p className="text-2xl font-bold text-white cursor-default">2</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all cursor-pointer hover:transform hover:scale-105">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-700 rounded-full">
                    <BookOpen className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-200 cursor-default">Procedimentos</h4>
                    <p className="text-2xl font-bold text-white cursor-default">12</p>
                  </div>
                </div>
              </div>

              {/* Admin Stats */}
              {isAdmin() && (
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-6 rounded-xl border border-amber-500/30">
                  <div className="flex items-center">
                    <div className="p-3 bg-amber-500/20 rounded-full">
                      <Users className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-amber-200 cursor-default">Usuários Ativos</h4>
                      <p className="text-2xl font-bold text-white cursor-default">24</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notificações Section */}
          {activeSection === "notificacoes" && (
            <div className="space-y-4">
              {isManager() && (
                <ProtectedRoute resource="notifications" action="create">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-amber-200 cursor-default">Painel de Gerenciamento</h4>
                        <p className="text-sm text-amber-300/80 cursor-default">
                          Você pode criar e gerenciar notificações
                        </p>
                      </div>
                      <CreateNotificationModal />
                    </div>
                  </div>
                </ProtectedRoute>
              )}

              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  <li className="p-4 flex items-center justify-between hover:bg-gray-700/50 transition-all cursor-pointer">
                    <div>
                      <p className="font-semibold text-red-400 cursor-default">URGENTE: Interdição na Obra B</p>
                      <p className="text-sm text-gray-400 mt-1 cursor-default">
                        Devido a fortes chuvas, o acesso ao canteiro de obras B está temporariamente interditado.
                      </p>
                      <p className="text-xs text-gray-500 mt-2 cursor-default">Hoje, 09:30</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 bg-red-500 rounded-full flex-shrink-0"></span>
                      {canUpdate("notifications") && (
                        <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                          Editar
                        </button>
                      )}
                    </div>
                  </li>

                  <li className="p-4 flex items-center justify-between hover:bg-gray-700/50 transition-all cursor-pointer">
                    <div>
                      <p className="font-semibold text-yellow-400 cursor-default">MUDANÇA: Alocação de Betoneira</p>
                      <p className="text-sm text-gray-400 mt-1 cursor-default">
                        A betoneira #3 foi realocada da Obra A para a Obra C para suprir a demanda.
                      </p>
                      <p className="text-xs text-gray-500 mt-2 cursor-default">Hoje, 11:15</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 bg-yellow-500 rounded-full flex-shrink-0"></span>
                      {canUpdate("notifications") && (
                        <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                          Editar
                        </button>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Avisos Section */}
          {activeSection === "avisos" && (
            <div className="space-y-6">
              {canCreate("notices") && (
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-200 cursor-default">Gerenciar Avisos</h4>
                      <p className="text-sm text-blue-300/80 cursor-default">
                        Você pode criar e editar avisos da empresa
                      </p>
                    </div>
                    <CreateAlertModal />
                  </div>
                </div>
              )}

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-white cursor-default">Nova Política de Segurança de EPIs</h3>
                  {canUpdate("notices") && (
                    <div className="flex space-x-2">
                      <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                        Editar
                      </button>
                      {canDelete("notices") && (
                        <button className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors">
                          Excluir
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4 cursor-default">Publicado em: 10 de Junho de 2025</p>
                <p className="text-gray-400 cursor-default">
                  A partir de 1º de Julho de 2025, será obrigatório o uso de capacetes com jugular em todas as áreas de
                  construção, sem exceção.
                </p>
              </div>
            </div>
          )}

          {/* Procedimentos Section */}
          {activeSection === "procedimentos" && (
            <div className="space-y-4">
              {canCreate("procedures") && (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-200 cursor-default">Gerenciar Procedimentos</h4>
                      <p className="text-sm text-green-300/80 cursor-default">
                        Você pode adicionar novos procedimentos
                      </p>
                    </div>
                    <CreateProcedureModal />
                  </div>
                </div>
              )}

              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <button
                  onClick={() => toggleAccordion("seguranca")}
                  className="w-full flex justify-between items-center text-left p-5 font-semibold text-white hover:bg-gray-700/50 transition-all rounded-xl cursor-pointer"
                >
                  <span>Segurança no Trabalho (NRs)</span>
                  <ChevronDown
                    className={`w-6 h-6 transform transition-transform ${accordionState.seguranca ? "rotate-180" : ""}`}
                  />
                </button>
                {accordionState.seguranca && (
                  <div className="px-5 pb-4">
                    <ul className="list-disc pl-8 text-gray-400 space-y-2">
                      <li>
                        <a
                          href="#"
                          className="hover:underline text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          NR-06: Equipamento de Proteção Individual (EPI) - Atualizado
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cadastros Section */}
          {activeSection === "cadastros" && (
            <ProtectedRoute
              resource="notices"
              action="create"
              fallback={
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2 cursor-default">Acesso Restrito</h3>
                  <p className="text-gray-500 cursor-default">
                    Apenas gerentes e administradores podem acessar esta seção.
                  </p>
                </div>
              }
            >
              <div className="max-w-6xl mx-auto">
                {/* Grid de Cards de Cadastro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Avisos da Empresa */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Info className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3 cursor-default">Avisos da Empresa</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed cursor-default">
                          Crie e gerencie avisos importantes para todos os funcionários.
                        </p>
                        <CreateAlertModal />
                      </div>
                    </div>
                  </div>

                  {/* Card Usuários do Sistema */}
                  {isAdmin() && (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-3 cursor-default">Usuários do Sistema</h3>
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed cursor-default">
                            Cadastre novos usuários e gerencie permissões de acesso.
                          </p>
                          <CreateUserModal />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Notificações Urgentes */}
                  {isManager() && (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                          <Bell className="h-8 w-8 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-3 cursor-default">
                            Notificações Urgentes
                          </h3>
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed cursor-default">
                            Envie notificações importantes para todos os usuários.
                          </p>
                          <CreateNotificationModal />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Documentos PDF */}
                  {canCreate("procedures") && (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                          <FileText className="h-8 w-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-3 cursor-default">Documentos PDF</h3>
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed cursor-default">
                            Faça upload de procedimentos e documentos em PDF.
                          </p>
                          <CreateProcedureModal />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Seção de Estatísticas */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm font-medium cursor-default">Total de Avisos</p>
                        <p className="text-2xl font-bold text-white mt-1 cursor-default">12</p>
                      </div>
                      <Info className="h-8 w-8 text-blue-400/60" />
                    </div>
                  </div>

                  {isAdmin() && (
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-400 text-sm font-medium cursor-default">Usuários Ativos</p>
                          <p className="text-2xl font-bold text-white mt-1 cursor-default">24</p>
                        </div>
                        <Users className="h-8 w-8 text-green-400/60" />
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-400 text-sm font-medium cursor-default">Procedimentos</p>
                        <p className="text-2xl font-bold text-white mt-1 cursor-default">8</p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-400/60" />
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          )}

          {/* Usuários Section - Admin Only */}
          {activeSection === "usuarios" && (
            <ProtectedRoute
              resource="users"
              action="read"
              fallback={
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2 cursor-default">Acesso Restrito</h3>
                  <p className="text-gray-500 cursor-default">Apenas administradores podem gerenciar usuários.</p>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white cursor-default">Gerenciar Usuários</h3>
                  {canCreate("users") && <CreateUserModal />}
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-default">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-default">
                          Função
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-default">
                          Departamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-default">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      <tr className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium text-amber-400 cursor-default">
                              AC
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-white cursor-default">Ana Clara</div>
                              <div className="text-sm text-gray-400 cursor-default">ana.clara@antonelly.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge role="admin" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-default">
                          Administração
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {canUpdate("users") && (
                              <button className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors">
                                Editar
                              </button>
                            )}
                            {canDelete("users") && (
                              <button className="text-red-400 hover:text-red-300 cursor-pointer transition-colors">
                                Excluir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ProtectedRoute>
          )}

          {/* Reuniões Section */}
          {activeSection === "reunioes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white cursor-default">Reuniões Agendadas</h3>
                <CreateMeetingModal />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 text-sm font-medium cursor-default">Hoje</p>
                      <p className="text-2xl font-bold text-white cursor-default">2</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-400/60" />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 text-sm font-medium cursor-default">Esta Semana</p>
                      <p className="text-2xl font-bold text-white cursor-default">7</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-400/60" />
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-400 text-sm font-medium cursor-default">Este Mês</p>
                      <p className="text-2xl font-bold text-white cursor-default">24</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-400/60" />
                  </div>
                </div>
              </div>

              {/* Upcoming Meetings */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h4 className="text-lg font-semibold text-white cursor-default">Próximas Reuniões</h4>
                </div>
                <div className="divide-y divide-gray-700">
                  <div className="p-6 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          <h5 className="text-white font-semibold cursor-default">Reunião sobre Projeto X</h5>
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded cursor-default">
                            Hoje
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 cursor-default">
                          Discussão sobre o andamento do projeto X e próximas etapas
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="cursor-default">📅 20/06/2025 - 17:00</span>
                          <span className="cursor-default">👥 Filipe Oliveira, João Silva</span>
                          <span className="cursor-default">📍 Sala de Reuniões A</span>
                          <span className="cursor-default">⏱️ 1h</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                          Editar
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                          <h5 className="text-white font-semibold cursor-default">Apresentação para Cliente ABC</h5>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded cursor-default">
                            Amanhã
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 cursor-default">
                          Apresentação da proposta final para o cliente ABC
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="cursor-default">📅 21/06/2025 - 14:30</span>
                          <span className="cursor-default">👥 Empresa ABC, Maria Santos</span>
                          <span className="cursor-default">🔗 Google Meet</span>
                          <span className="cursor-default">⏱️ 2h</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                          Editar
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                          <h5 className="text-white font-semibold cursor-default">Reunião de Segurança Mensal</h5>
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded cursor-default">
                            25/06
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 cursor-default">
                          Revisão dos procedimentos de segurança e discussão de melhorias
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="cursor-default">📅 25/06/2025 - 09:00</span>
                          <span className="cursor-default">👥 Equipe de Segurança</span>
                          <span className="cursor-default">📍 Auditório Principal</span>
                          <span className="cursor-default">⏱️ 1h30</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-amber-400 hover:text-amber-300 text-sm cursor-pointer transition-colors">
                          Editar
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Meetings */}
              <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h4 className="text-lg font-semibold text-white cursor-default">Reuniões Recentes</h4>
                </div>
                <div className="divide-y divide-gray-700">
                  <div className="p-6 hover:bg-gray-700/50 transition-colors opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                          <h5 className="text-white font-semibold cursor-default">Reunião de Planejamento</h5>
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded cursor-default">
                            Concluída
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 cursor-default">
                          Planejamento das atividades da próxima semana
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="cursor-default">📅 18/06/2025 - 15:00</span>
                          <span className="cursor-default">👥 Carlos Silva, Ana Clara</span>
                          <span className="cursor-default">📍 Sala de Reuniões B</span>
                          <span className="cursor-default">⏱️ 45min</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer transition-colors">
                          Ver Ata
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
