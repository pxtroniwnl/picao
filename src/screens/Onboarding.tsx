'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { OCancha } from '../components/Shared'
export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0)
  const slides = [
    {
      title: 'ARMA TU PICAO',
      desc: 'Elige la cancha, pon la hora y organiza el partido con tus vales.',
      icon: '🏟️',
    },
    {
      title: 'LLENA LOS CUPOS',
      desc: 'Publica tu picao para que otros jugadores se unan y completen los equipos.',
      icon: '👥',
    },
    {
      title: 'RESCATA JUGADORES',
      desc: '¿Te falta uno a última hora? Encuentra reemplazos rápido y no canceles.',
      icon: '🚑',
    },
  ]
  const next = () => {
    if (step < slides.length - 1) setStep(step + 1)
    else onComplete()
  }
  return (
    <div className="flex flex-col h-full bg-carbon px-6 py-12 relative">
      <div className="flex justify-end pt-4">
        <button onClick={onComplete} className="text-gris text-sm font-medium">
          Saltar
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{
              x: 50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -50,
              opacity: 0,
            }}
            className="flex flex-col items-center"
          >
            <div className="w-40 h-40 bg-superficie rounded-full flex items-center justify-center mb-10 border-4 border-white/5 relative">
              <span className="text-6xl">{slides[step].icon}</span>
              <OCancha className="absolute -bottom-2 -right-2 w-12 h-12 bg-carbon" />
            </div>
            <h1 className="font-display text-3xl text-crema mb-4">
              {slides[step].title}
            </h1>
            <p className="text-gris text-lg leading-relaxed px-4">
              {slides[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-naranja' : 'w-2 bg-superficie'}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {step === slides.length - 1 ? 'EMPEZAR' : 'SIGUIENTE'}{' '}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
