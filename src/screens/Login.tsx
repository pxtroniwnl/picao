'use client'

import React, { useState } from 'react'
import { ChevronLeft, Loader2, MailCheck } from 'lucide-react'
import { Logo } from '../components/Shared'
import { enviarEnlace } from '../lib/auth'

export const Login = ({
  nuevo,
  onBack,
}: {
  nuevo: boolean
  onBack: () => void
}) => {
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
  const emailOk = /\S+@\S+\.\S+/.test(email.trim())

  const enviar = async () => {
    setCargando(true)
    setError(null)
    const { error } = await enviarEnlace(email.trim(), { nuevo })
    setCargando(false)
    if (error) {
      setError(
        nuevo
          ? 'No pudimos enviar el enlace. Intenta de nuevo.'
          : 'No encontramos esa cuenta o falló el envío. Revisa el correo.',
      )
      return
    }
    setEnviado(true)
  }

  // Estado: enlace enviado.
  if (enviado) {
    return (
      <div className="flex flex-col h-full bg-carbon px-6 pt-16">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 mb-6 rounded-full flex items-center justify-center text-crema"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 rounded-full bg-verde/10 border border-verde/30 flex items-center justify-center mb-6">
            <MailCheck className="text-verde" size={36} />
          </div>
          <h1 className="font-display text-2xl text-crema mb-3">REVISA TU CORREO</h1>
          <p className="text-gris leading-relaxed mb-8">
            Te enviamos un enlace a <span className="text-crema">{email.trim()}</span>. Ábrelo
            desde este celular y entras solo. Revisa también spam.
          </p>
          <button onClick={enviar} className="text-naranja text-sm font-medium">
            ¿No te llegó? Reenviar enlace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-carbon px-6 pt-16">
      <button
        onClick={onBack}
        className="w-10 h-10 -ml-2 mb-6 rounded-full flex items-center justify-center text-crema"
      >
        <ChevronLeft size={24} />
      </button>
      <Logo className="text-2xl" iconSize="w-6 h-6" />

      <h1 className="font-display text-2xl text-crema mb-2 mt-8">
        {nuevo ? 'CREA TU CUENTA' : 'INICIAR SESIÓN'}
      </h1>
      <p className="text-gris mb-8">
        Te mandamos un enlace al correo. Sin contraseñas, sin vueltas.
      </p>

      <div className="space-y-4 flex-1">
        <div>
          <label className="text-sm text-gris mb-2 block">Correo</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            type="email"
            inputMode="email"
            placeholder="tucorreo@mail.com"
            className="w-full bg-superficie border border-white/10 rounded-xl px-4 py-4 text-crema font-medium outline-none focus:border-naranja transition-colors"
          />
          {error && <p className="text-magenta text-sm mt-2">{error}</p>}
        </div>
      </div>

      <button
        onClick={enviar}
        disabled={!emailOk || cargando}
        className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mb-8 flex items-center justify-center gap-2"
      >
        {cargando ? <Loader2 size={20} className="animate-spin" /> : 'ENVIAR ENLACE'}
      </button>
    </div>
  )
}
