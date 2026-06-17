'use client'

import React, { useState } from 'react'
import { Globe, Lock, Trophy, MessageCircle } from 'lucide-react'
import { FieldCard } from '../components/Shared'
import { Picao } from '../data/picaos'
export const MisPartidos = ({
  created,
  participo,
  historial,
  onSelectPicao,
  onToggleVisibility,
  onChat,
}: {
  created: Picao[]
  participo: Picao[]
  historial: Picao[]
  onSelectPicao: (p: Picao) => void
  onToggleVisibility: (id: string) => void
  onChat: (p: Picao) => void
}) => {
  const [tab, setTab] = useState<'creados' | 'participo' | 'historial'>('creados')
  const tabs = [
    { id: 'creados', label: 'Creados' },
    { id: 'participo', label: 'Participo' },
    { id: 'historial', label: 'Historial' },
  ] as const
  return (
    <div className="flex flex-col h-full bg-carbon relative pb-20">
      <div className="px-5 pt-12 pb-4 bg-carbon z-10 sticky top-0">
        <h1 className="font-display text-2xl text-crema mb-6">MIS PICAOS</h1>
        <div className="flex bg-superficie rounded-xl p-1 gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors ${tab === t.id ? 'bg-carbon text-crema' : 'text-gris'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-6 space-y-4">
        {tab === 'creados' &&
          (created.length > 0 ? (
            created.map((p) => (
              <div key={p.id} className="space-y-2">
                <FieldCard picao={p} onClick={() => onSelectPicao(p)} />
                <div className="flex gap-2">
                  {p.status !== 'jugado' && (
                    <button onClick={() => onChat(p)} className="flex-1 flex items-center justify-center gap-2 bg-superficie rounded-xl py-2.5 text-xs font-semibold text-crema border border-white/5 active:scale-95 transition-transform">
                      <MessageCircle size={14} className="text-verde" /> Chat
                    </button>
                  )}
                  <button onClick={() => onToggleVisibility(p.id)} className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl border transition-all ${p.visibility === 'privado' ? 'border-naranja/40 bg-naranja/10 text-naranja' : 'border-verde/40 bg-verde/10 text-verde'}`}>
                    {p.visibility === 'privado' ? (<><Lock size={13} /> Privado</>) : (<><Globe size={13} /> Público</>)}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gris mt-10">Aún no has creado picaos. Toca el “+” para crear uno.</div>
          ))}

        {tab === 'participo' &&
          (participo.length > 0 ? (
            participo.map((p) => (
              <div key={p.id} className="space-y-2">
                <FieldCard picao={p} onClick={() => onSelectPicao(p)} />
                {p.status !== 'jugado' && (
                  <button onClick={() => onChat(p)} className="w-full flex items-center justify-center gap-2 bg-superficie rounded-xl py-2.5 text-xs font-semibold text-crema border border-white/5 active:scale-95 transition-transform">
                    <MessageCircle size={14} className="text-verde" /> Abrir chat del picao
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gris mt-10">Aún no te has unido a ningún picao.</div>
          ))}

        {tab === 'historial' &&
          (historial.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-gris text-xs mb-1">
                <Trophy size={14} className="text-naranja" /> Picaos que ya jugaste
              </div>
              {historial.map((p) => (
                <div key={p.id} className="relative opacity-90">
                  <FieldCard picao={p} onClick={() => onSelectPicao(p)} />
                  <span className="absolute top-2 right-2 z-10 bg-carbon/80 backdrop-blur-sm text-crema/80 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Jugado</span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-gris mt-10">Aún no tienes picaos jugados.</div>
          ))}
      </div>
    </div>
  )
}
