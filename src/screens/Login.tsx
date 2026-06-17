'use client'

import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Logo } from '../components/Shared'

export const Login = ({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: () => void
}) => {
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const ok = nickname.trim() && password.length >= 4
  return (
    <div className="flex flex-col h-full bg-carbon px-6 pt-16">
      <button
        onClick={onBack}
        className="w-10 h-10 -ml-2 mb-6 rounded-full flex items-center justify-center text-crema"
      >
        <ChevronLeft size={24} />
      </button>
      <Logo className="text-2xl" iconSize="w-6 h-6" />

      <h1 className="font-display text-2xl text-crema mb-2 mt-8">INICIAR SESIÓN</h1>
      <p className="text-gris mb-8">Entra con tu nickname.</p>

      <div className="space-y-4 flex-1">
        <div>
          <label className="text-sm text-gris mb-2 block">Nickname</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ej. ElPibe10"
            className="w-full bg-superficie border border-white/10 rounded-xl px-4 py-4 text-crema font-medium outline-none focus:border-naranja transition-colors"
          />
        </div>
        <div>
          <label className="text-sm text-gris mb-2 block">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-superficie border border-white/10 rounded-xl px-4 py-4 text-crema font-medium outline-none focus:border-naranja transition-colors"
          />
        </div>
        <button className="text-naranja text-sm font-medium">¿Olvidaste tu contraseña?</button>
      </div>

      <button
        onClick={onComplete}
        disabled={!ok}
        className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mb-8"
      >
        ENTRAR A LA CANCHA
      </button>
    </div>
  )
}
