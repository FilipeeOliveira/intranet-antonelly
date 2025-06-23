"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, Building2 } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Email ou senha incorretos")
    }
  }

  const demoUsers = [
    { email: "ana.clara@antonelly.com", password: "admin123", role: "Administrador" },
    { email: "carlos.silva@antonelly.com", password: "manager123", role: "Gerente" },
    { email: "maria.santos@antonelly.com", password: "engineer123", role: "Engenheira" },
    { email: "joao.pereira@antonelly.com", password: "worker123", role: "Trabalhador" },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Building2 className="h-12 w-12 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white cursor-default">
            Antonelly<span className="text-amber-400">Construções</span>
          </h1>
          <p className="mt-2 text-gray-400 cursor-default">Sistema Interno - Faça seu login</p>
        </div>

        <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-xl border border-gray-700" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 cursor-default">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 transition-all outline-none focus:outline-none cursor-text hover:shadow-md"
              placeholder="seu.email@antonelly.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 cursor-default">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 pr-10 transition-all outline-none focus:outline-none cursor-text hover:shadow-md"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 cursor-pointer transition-colors outline-none focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg cursor-default">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:transform hover:scale-105 active:transform active:scale-95 outline-none focus:outline-none"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Demo Users */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 cursor-default">Usuários de Demonstração</h3>
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-300 cursor-default">{user.email}</p>
                  <p className="text-gray-500 cursor-default">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    setEmail(user.email)
                    setPassword(user.password)
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors outline-none focus:outline-none"
                >
                  Usar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
