'use client'

import React from 'react'
import {
  ChevronLeft,
  Bell,
  Calendar,
  MessageCircle,
  AlertCircle,
} from 'lucide-react'
export const Notificaciones = ({ onBack }: { onBack: () => void }) => {
  const notifs = [
    {
      id: 1,
      type: 'urgent',
      icon: <AlertCircle size={20} />,
      color: 'text-magenta',
      bg: 'bg-magenta/10',
      title: '¡Cupo liberado!',
      desc: 'Alguien canceló en Cancha Sintética. ¡Aprovecha!',
      time: 'Hace 5 min',
      unread: true,
    },
    {
      id: 2,
      type: 'success',
      icon: <Calendar size={20} />,
      color: 'text-verde',
      bg: 'bg-verde/10',
      title: 'Picao Confirmado',
      desc: 'Tu partido de mañana a las 7:30 PM está listo.',
      time: 'Hace 2 horas',
      unread: true,
    },
    {
      id: 3,
      type: 'message',
      icon: <MessageCircle size={20} />,
      color: 'text-crema',
      bg: 'bg-superficie',
      title: 'Nuevo mensaje',
      desc: 'Carlos: "Lleguen 15 min antes..."',
      time: 'Ayer',
      unread: false,
    },
    {
      id: 4,
      type: 'reminder',
      icon: <Bell size={20} />,
      color: 'text-naranja',
      bg: 'bg-naranja/10',
      title: 'Recordatorio',
      desc: 'No olvides calificar a los jugadores de tu último picao.',
      time: 'Hace 2 días',
      unread: false,
    },
  ]
  return (
    <div className="flex flex-col h-full bg-carbon relative">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4 bg-carbon z-10 sticky top-0">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-superficie flex items-center justify-center text-crema"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display text-xl text-crema mt-1">NOTIFICACIONES</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-6 space-y-4">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex gap-4 p-4 rounded-xl border ${n.unread ? 'border-white/10 bg-superficie/80' : 'border-transparent bg-transparent'}`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n.bg} ${n.color}`}
            >
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4
                  className={`text-sm font-medium ${n.unread ? 'text-crema' : 'text-gris'}`}
                >
                  {n.title}
                </h4>
                {n.unread && (
                  <div className="w-2 h-2 bg-naranja rounded-full mt-1.5"></div>
                )}
              </div>
              <p className="text-xs text-gris mb-2">{n.desc}</p>
              <div className="text-[10px] text-gris/60">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
