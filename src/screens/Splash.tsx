'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { OCancha } from '../components/Shared'
export const Splash = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3300)
    return () => clearTimeout(timer)
  }, [onComplete])
  return (
    <div
      className="flex flex-col h-full bg-carbon items-center justify-center relative cursor-pointer"
      onClick={onComplete}
    >
      <motion.div
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 100,
        }}
        className="mb-6"
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
          delay: 0.4,
          duration: 0.6,
        }}
        className="flex items-center gap-1"
      >
        <span className="font-display text-4xl text-crema tracking-wider">
          PICA
        </span>
        <OCancha className="w-8 h-8 -mt-1" />
        <span className="font-display text-4xl text-naranja tracking-wider">
          .
        </span>
      </motion.div>

      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.0,
          duration: 0.7,
        }}
        className="text-gris mt-4 font-medium tracking-wide"
      >
        FÚTBOL EN CARTAGENA
      </motion.p>

      {/* loader dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-16 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-verde"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
