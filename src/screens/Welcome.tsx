'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { OCancha } from '../components/Shared'

export const Welcome = ({
  onRegister,
  onLogin,
}: {
  onRegister: () => void
  onLogin: () => void
}) => {
  return (
    <div className="flex flex-col h-full bg-carbon px-6 pt-24 pb-12 relative overflow-hidden">
      {/* glows */}
      <div className="absolute -top-24 -right-20 w-72 h-72 bg-naranja/20 rounded-full blur-3xl" />
      <div className="absolute bottom-44 -left-24 w-72 h-72 bg-verde/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className="mb-8"
        >
          <OCancha className="w-24 h-24 border-4" />
        </motion.div>

        <div className="flex items-center gap-1 mb-5">
          <span className="font-display text-5xl text-crema tracking-wider">PICA</span>
          <OCancha className="w-10 h-10 -mt-1" />
          <span className="font-display text-5xl text-naranja tracking-wider">.</span>
        </div>

        <h1 className="font-display text-2xl text-crema leading-tight mb-3">
          ARMA, LLENA Y JUEGA<br />TU PICAO
        </h1>
        <p className="text-gris text-lg leading-relaxed">
          El fútbol de Cartagena en una sola app. Encuentra partido o llena tus cupos en minutos.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <button
          onClick={onRegister}
          className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform"
        >
          CREAR CUENTA
        </button>
        <button
          onClick={onLogin}
          className="w-full bg-transparent border border-white/15 text-crema font-display text-lg py-4 rounded-xl active:scale-95 transition-transform"
        >
          YA TENGO CUENTA
        </button>
      </div>
    </div>
  )
}
