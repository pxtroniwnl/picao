'use client'

import React from 'react'
import {
  ChevronLeft,
  Share2,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
} from 'lucide-react'
import { AvatarStack } from '../components/Shared'
import { Picao, FIELDS } from '../data/picaos'
export const Detalle = ({
  picao,
  onBack,
  onJoin,
  onChat,
}: {
  picao: Picao
  onBack: () => void
  onJoin: () => void
  onChat: () => void
}) => {
  const field = FIELDS[picao.fieldId]
  const isUrgent =
    picao.totalSlots - picao.slots <= 2 && picao.totalSlots !== picao.slots
  const mine = !!(picao.createdByMe || picao.joined)
  const active = picao.status !== 'jugado'
  const chatAvailable = mine && active
  return (
    <div className="flex flex-col h-full bg-carbon relative">
      <div className="absolute top-0 left-0 right-0 p-5 pt-12 flex items-center justify-between z-20">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-carbon/80 backdrop-blur flex items-center justify-center text-crema">
          <ChevronLeft size={24} />
        </button>
        <button className="w-10 h-10 rounded-full bg-carbon/80 backdrop-blur flex items-center justify-center text-crema">
          <Share2 size={20} />
        </button>
      </div>

      <div className="h-64 bg-superficie relative">
        <img src={field.photoUrl} alt={field.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon to-transparent"></div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 -mt-10 relative z-10 pb-32">
        <div className="inline-block px-3 py-1 bg-naranja text-crema text-xs font-bold uppercase tracking-wider rounded-md mb-3">
          Fútbol {picao.format}
        </div>
        <h1 className="font-display text-3xl text-crema leading-tight mb-2">{field.name}</h1>
        <div className="flex items-center gap-2 text-gris mb-6">
          <MapPin size={16} />
          <span>{field.barrio}, Cartagena</span>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5">
            <Calendar className="text-naranja" size={24} />
            <div className="text-sm font-medium text-crema">{picao.date}</div>
          </div>
          <div className="flex-1 bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5">
            <Clock className="text-naranja" size={24} />
            <div className="text-sm font-medium text-crema">{picao.time}</div>
          </div>
          <div className="flex-1 bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5">
            <Clock className="text-naranja" size={24} />
            <div className="text-sm font-medium text-crema">{picao.duration}</div>
          </div>
        </div>

        {/* Chat temporal (solo si es tuyo y está activo) */}
        {chatAvailable && (
          <button onClick={onChat} className="w-full flex items-center gap-3 bg-superficie rounded-2xl p-4 border border-verde/20 mb-6 text-left active:scale-[0.98] transition-transform">
            <div className="w-11 h-11 rounded-full bg-verde/15 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-verde" />
            </div>
            <div className="flex-1">
              <div className="text-crema font-medium text-sm">Chat del picao</div>
              <div className="text-xs text-gris">Temporal · activo mientras el picao esté en juego</div>
            </div>
            <span className="text-verde text-xs font-display">ABRIR</span>
          </button>
        )}

        <div className="bg-superficie rounded-2xl p-5 border border-white/5 mb-6">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-display text-lg text-crema">CUPOS</h3>
            {isUrgent && (<span className="text-magenta font-bold text-sm uppercase">¡{picao.totalSlots - picao.slots} Disponibles!</span>)}
          </div>
          <div className="h-3 bg-carbon rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-verde rounded-full transition-all" style={{ width: `${(picao.slots / picao.totalSlots) * 100}%` }}></div>
          </div>
          <div className="text-sm text-crema mb-4 font-medium">{picao.slots}/{picao.totalSlots} confirmados</div>
          <AvatarStack count={picao.slots} total={picao.totalSlots} players={picao.players} />
        </div>

        <div className="flex items-center gap-4 bg-superficie rounded-2xl p-4 border border-white/5 mb-6">
          <img src={picao.organizer.avatar} alt="Organizer" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="text-xs text-gris mb-0.5">Organiza</div>
            <div className="text-crema font-medium">{picao.organizer.name}</div>
            <div className="text-xs text-naranja mt-0.5 font-medium">★ {picao.organizer.rating}</div>
          </div>
        </div>

        <div className="bg-superficie rounded-2xl h-32 border border-white/5 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 grayscale"></div>
          <div className="z-10 flex flex-col items-center">
            <MapPin className="text-naranja mb-1" size={32} />
            <span className="text-xs font-medium text-crema bg-carbon/80 px-2 py-1 rounded">Ver en mapa</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-carbon border-t border-white/5 p-5 pb-8 z-20">
        {mine ? (
          <button onClick={onChat} disabled={!active} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
            <MessageCircle size={20} /> {active ? 'ABRIR CHAT DEL PICAO' : 'CHAT CERRADO'}
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gris mb-1">Total por jugador</div>
              <div className="text-crema font-display text-xl">${(picao.price * (picao.hoursCount || 1)).toLocaleString('es-CO')}</div>
            </div>
            <button onClick={onJoin} className="bg-verde text-carbon font-display text-lg px-8 py-4 rounded-xl active:scale-95 transition-transform">UNIRME AL PICAO</button>
          </div>
        )}
      </div>
    </div>
  )
}
