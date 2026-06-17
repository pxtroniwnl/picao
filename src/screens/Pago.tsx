'use client'

import React, { useState } from 'react'
import { ChevronLeft, Calendar } from 'lucide-react'
import { Picao, FIELDS, FORMAT_LABEL } from '../data/picaos'

const money = (n: number) => '$' + n.toLocaleString('es-CO')

export const Pago = ({
  picao,
  onBack,
  onPay,
}: {
  picao: Picao
  onBack: () => void
  onPay: () => void
}) => {
  const [method, setMethod] = useState('nequi')
  const field = FIELDS[picao.fieldId]
  const hoursCount = picao.hoursCount || 1
  const total = picao.price * hoursCount
  return (
    <div className="flex flex-col h-full bg-carbon relative">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4 bg-carbon z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-superficie flex items-center justify-center text-crema">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display text-xl text-crema mt-1">TU PAGO</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-32">
        <div className="bg-superficie rounded-2xl p-4 border border-white/5 mb-6 flex items-center gap-4">
          <img src={field.photoUrl} alt={field.name} className="w-16 h-16 rounded-xl object-cover" />
          <div className="min-w-0">
            <h3 className="font-display text-crema text-sm truncate">{field.name}</h3>
            <div className="text-xs text-gris mt-1">
              {picao.date} · {picao.time} · {FORMAT_LABEL[picao.format] || picao.format}
            </div>
            <div className="text-xs text-gris">#{picao.code}</div>
          </div>
        </div>

        {/* Total personal */}
        <div className="bg-verde/10 border border-verde/30 rounded-2xl p-6 text-center mb-8">
          <div className="text-gris text-sm mb-1">Total a pagar (tu parte)</div>
          <div className="font-display text-5xl text-verde">{money(total)}</div>
          <div className="text-xs text-gris mt-2">
            {money(picao.price)}/hora · {hoursCount} {hoursCount === 1 ? 'hora' : 'horas'} · incluye cancha
          </div>
        </div>

        <h3 className="text-crema font-medium mb-4">Método de pago</h3>
        <div className="space-y-3 mb-8">
          {[
            { id: 'nequi', name: 'Nequi', color: 'bg-[#E10098]' },
            { id: 'daviplata', name: 'Daviplata', color: 'bg-[#ED1C24]' },
            { id: 'tarjeta', name: 'Tarjeta de Crédito/Débito', color: 'bg-superficie' },
          ].map((m) => (
            <div key={m.id} onClick={() => setMethod(m.id)} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${method === m.id ? 'border-naranja bg-naranja/10' : 'border-superficie bg-superficie'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-white font-bold text-xs`}>
                  {m.id === 'tarjeta' ? <Calendar size={14} /> : m.name[0]}
                </div>
                <span className="text-crema font-medium">{m.name}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-naranja' : 'border-gris'}`}>
                {method === m.id && <div className="w-2.5 h-2.5 bg-naranja rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-naranja/10 border border-naranja/20 rounded-xl p-4 text-sm text-crema/80 leading-relaxed">
          <span className="text-naranja font-bold">Nota:</span> Tu pago asegura el cupo y la reserva de la cancha. Se devuelve si el picao se cancela o no se llena.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-carbon border-t border-white/5 p-5 pb-8 z-20">
        <button onClick={onPay} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
          PAGAR {money(total)}
        </button>
      </div>
    </div>
  )
}
