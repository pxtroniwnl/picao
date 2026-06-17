'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Share2, Calendar, Navigation, MessageCircle } from 'lucide-react'
import { OCancha } from '../components/Shared'
import { Picao, FIELDS } from '../data/picaos'
export const Confirmado = ({
  picao,
  onChat,
  onHome,
}: {
  picao: Picao
  onChat: () => void
  onHome: () => void
}) => {
  const field = FIELDS[picao.fieldId]
  return (
    <div className="flex flex-col h-full bg-carbon relative items-center justify-center px-5">
      <motion.div
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100,
        }}
        className="mb-8"
      >
        <OCancha className="w-32 h-32 border-4" />
      </motion.div>

      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.2,
        }}
        className="text-center w-full"
      >
        <h1 className="font-display text-4xl text-crema mb-2">
          ¡ESTÁS DENTRO!
        </h1>
        <p className="text-gris mb-8">Tu cupo está asegurado. ¡A romperla!</p>

        <div className="bg-superficie rounded-2xl p-5 border border-white/5 mb-8 text-left flex items-center gap-4">
          <img
            src={field.photoUrl}
            alt={field.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-display text-sm text-crema mb-1">
              {field.name}
            </h3>
            <div className="text-xs text-gris">
              {picao.date} · {picao.time}
            </div>
            <div className="text-xs text-gris">{field.barrio}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Share2 size={20} /> COMPARTIR PICAO
          </button>
          <div className="flex gap-3">
            <button className="flex-1 bg-superficie text-crema font-medium py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 border border-white/5">
              <Calendar size={18} /> Calendario
            </button>
            <button className="flex-1 bg-superficie text-crema font-medium py-3.5 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 border border-white/5">
              <Navigation size={18} /> Llegar
            </button>
          </div>
        </div>

        <button
          onClick={onChat}
          className="mt-8 flex items-center justify-center gap-2 text-crema font-medium w-full py-4"
        >
          <MessageCircle size={20} className="text-naranja" /> Ver chat del
          picao
        </button>

        <button
          onClick={onHome}
          className="mt-2 text-gris text-sm underline underline-offset-4"
        >
          Volver al inicio
        </button>
      </motion.div>
    </div>
  )
}
