'use client'

import React from 'react'
import { ChevronLeft, Send, Smile, Clock } from 'lucide-react'
import { Picao, FIELDS } from '../data/picaos'
export const Chat = ({
  picao,
  onBack,
}: {
  picao: Picao
  onBack: () => void
}) => {
  const field = FIELDS[picao.fieldId]
  const closed = picao.status === 'jugado'
  return (
    <div className="flex flex-col h-full bg-carbon relative">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4 bg-superficie border-b border-white/5 z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-carbon flex items-center justify-center text-crema">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-display text-lg text-crema">{field.name}</h1>
          <div className="text-xs text-gris">{picao.slots} jugadores unidos · #{picao.code}</div>
        </div>
      </div>

      {/* Aviso de chat temporal */}
      <div className={`px-5 py-2 flex items-center justify-center gap-1.5 text-[11px] text-center border-b ${closed ? 'bg-gris/10 border-white/5 text-gris' : 'bg-naranja/10 border-naranja/20 text-naranja'}`}>
        <Clock size={12} />
        {closed ? 'Chat cerrado · este picao ya se jugó' : 'Chat temporal · activo mientras el picao esté en juego'}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-6 pb-24 space-y-6">
        <div className="text-center text-xs text-gris bg-superficie/50 py-1 px-3 rounded-full w-max mx-auto">Hoy</div>
        <div className="flex gap-3">
          <img src={picao.organizer.avatar} className="w-8 h-8 rounded-full" alt="Org" />
          <div className="flex-1">
            <div className="text-xs text-gris mb-1">{picao.organizer.name}<span className="text-naranja ml-1">Organizador</span></div>
            <div className="bg-superficie text-crema p-3 rounded-2xl rounded-tl-none inline-block text-sm">¡Muchachos! Lleguen 15 min antes para calentar.</div>
          </div>
        </div>
        <div className="text-center text-xs text-verde bg-verde/10 py-1 px-3 rounded-full w-max mx-auto border border-verde/20">Kevin se unió al picao</div>
        <div className="flex gap-3 flex-row-reverse">
          <div className="flex-1 flex flex-col items-end">
            <div className="text-xs text-gris mb-1">Tú</div>
            <div className="bg-naranja/20 border border-naranja/30 text-crema p-3 rounded-2xl rounded-tr-none inline-block text-sm">De una, ahí nos vemos.</div>
          </div>
        </div>
        {!closed && (
          <div className="text-center text-xs text-magenta bg-magenta/10 py-1 px-3 rounded-full w-max mx-auto border border-magenta/20">¡Quedan 2 cupos!</div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-carbon border-t border-white/5 p-4 pb-8 z-20 flex items-center gap-3">
        {closed ? (
          <div className="flex-1 text-center text-sm text-gris py-3">Este chat ya se cerró</div>
        ) : (
          <>
            <button className="text-gris"><Smile size={24} /></button>
            <div className="flex-1 bg-superficie rounded-full px-4 py-3 flex items-center border border-white/5">
              <input type="text" placeholder="Escribe un mensaje..." className="bg-transparent border-none text-crema text-sm w-full outline-none" />
            </div>
            <button className="w-12 h-12 bg-verde rounded-full flex items-center justify-center text-carbon"><Send size={20} className="ml-1" /></button>
          </>
        )}
      </div>
    </div>
  )
}
