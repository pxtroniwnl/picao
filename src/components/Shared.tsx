'use client'

import React from 'react'
import { MapPin, Map, Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Picao, FIELDS } from '../data/picaos'
export const OCancha = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <div
    className={`relative rounded-full border-2 border-naranja flex items-center justify-center ${className}`}
  >
    <div className="w-full h-[2px] bg-verde absolute top-1/2 left-0 -translate-y-1/2"></div>
    <div className="w-1.5 h-1.5 bg-verde rounded-full z-10"></div>
  </div>
)
export const Logo = ({
  className = 'text-xl',
  iconSize = 'w-5 h-5',
}: {
  className?: string
  iconSize?: string
}) => (
  <div className="flex items-center gap-0.5">
    <span className={`font-display text-crema tracking-wider ${className}`}>
      PICA
    </span>
    <OCancha className={`${iconSize} -mt-0.5`} />
    <span className={`font-display text-naranja tracking-wider ${className}`}>
      .
    </span>
  </div>
)
export const AvatarStack = ({
  count,
  total,
  players = [],
}: {
  count: number
  total: number
  players?: string[]
}) => {
  const displayAvatars =
    players.length > 0
      ? players
      : Array(count).fill('https://i.pravatar.cc/100')
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayAvatars.slice(0, Math.min(count, 4)).map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Player"
            className="w-8 h-8 rounded-full border-2 border-superficie object-cover"
          />
        ))}
      </div>
      {count > 4 && (
        <span className="text-xs text-gris ml-2 font-medium">
          y {count - 4} más
        </span>
      )}
    </div>
  )
}
export const FieldCard = ({
  picao,
  onClick,
}: {
  picao: Picao
  onClick: () => void
}) => {
  const field = FIELDS[picao.fieldId]
  const isUrgent =
    picao.totalSlots - picao.slots <= 2 && picao.totalSlots !== picao.slots
  return (
    <motion.div
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="bg-superficie rounded-2xl overflow-hidden cursor-pointer border border-white/5 flex flex-col"
    >
      <div className="h-24 relative">
        <img
          src={field.photoUrl}
          alt={field.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-superficie to-transparent"></div>
        <div className="absolute top-2 left-2 bg-carbon/70 backdrop-blur-sm text-crema/80 text-[10px] px-2 py-1 rounded-md font-mono tracking-wider">
          #{picao.code}
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
          <h3 className="font-display text-lg text-crema leading-tight drop-shadow-md">
            {field.name}
          </h3>
        </div>
      </div>

      <div className="p-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-gris mb-3">
          <span>
            {picao.date} · {picao.time}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {field.barrio}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-2">
            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isUrgent ? 'bg-magenta text-crema' : picao.slots === picao.totalSlots ? 'bg-gris/30 text-crema' : 'bg-carbon text-crema'}`}
            >
              {isUrgent
                ? `¡${picao.totalSlots - picao.slots} CUPOS!`
                : picao.slots === picao.totalSlots
                  ? 'LLENO'
                  : `${picao.slots}/${picao.totalSlots} CUPOS`}
            </div>
            <AvatarStack
              count={picao.slots}
              total={picao.totalSlots}
              players={picao.players}
            />
          </div>
          <div className="text-right">
            <div className="text-xs text-gris mb-1">Seña</div>
            <div className="text-verde font-bold text-lg">
              ${picao.price.toLocaleString('es-CO')}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export const BottomNav = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) => {
  const tabs = [
    {
      id: 'home',
      icon: <Map size={24} />,
      label: 'Picaos',
    },
    {
      id: 'mis-partidos',
      icon: <Calendar size={24} />,
      label: 'Mis picaos',
    },
    {
      id: 'perfil',
      icon: <Users size={24} />,
      label: 'Perfil',
    },
  ]
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-carbon border-t border-white/5 flex items-center justify-around px-2 pb-4 z-40">
      {tabs.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center gap-1 w-20 ${activeTab === item.id ? 'text-naranja' : 'text-gris'}`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
