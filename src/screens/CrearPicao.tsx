'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Check, Clock, Globe, Lock } from 'lucide-react'
import { FIELDS, FORMAT_PLAYERS, FORMAT_LABEL, Picao } from '../data/picaos'

const money = (n: number) => '$' + n.toLocaleString('es-CO')
const GANANCIA = 1250
const perHourPerson = (fieldId: string) => {
  const f = FIELDS[fieldId]
  return Math.round(f.pricePerHour / FORMAT_PLAYERS[f.format]) + GANANCIA
}

export const CrearPicao = ({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: (p: Picao) => void
}) => {
  const [step, setStep] = useState(1)
  const [fieldId, setFieldId] = useState('f1')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState<string[]>([])
  const [visibility, setVisibility] = useState<'publico' | 'privado'>('publico')

  const field = FIELDS[fieldId]
  const players = FORMAT_PLAYERS[field.format]
  const valorHora = perHourPerson(fieldId)
  const totalPersona = valorHora * hours.length

  const takenSet = (() => {
    if (!date) return new Set<string>()
    let h = 0
    for (const c of date + fieldId) h = (h * 31 + c.charCodeAt(0)) >>> 0
    const arr = field.hours
    return new Set([arr[h % arr.length], arr[(h >> 3) % arr.length]])
  })()

  const selectField = (id: string) => {
    setFieldId(id)
    setHours([])
  }
  const onDate = (d: string) => {
    setDate(d)
    setHours([])
  }
  const toggleHour = (hh: string) => {
    if (takenSet.has(hh)) return
    setHours((prev) => (prev.includes(hh) ? prev.filter((x) => x !== hh) : [...prev, hh]))
  }

  const canNext = step === 1 ? true : step === 2 ? !!date && hours.length > 0 : true
  const publish = () => {
    const nuevo: Picao = {
      id: 'u' + Date.now(),
      code: 'PCO-' + Math.floor(1000 + Math.random() * 9000),
      fieldId,
      date: date || 'Por definir',
      time: hours[0] || '',
      duration: hours.length + ' h',
      hoursCount: hours.length,
      format: field.format,
      slots: 1,
      totalSlots: players,
      price: valorHora,
      urgent: false,
      map: { x: 50, y: 50 },
      distanceKm: 0.6,
      organizer: { name: 'Tú', rating: 5.0, avatar: 'https://i.pravatar.cc/100?img=12' },
      players: [],
      status: 'abierto',
      visibility,
      createdByMe: true,
    }
    onComplete(nuevo)
  }
  const next = () => {
    if (step < 3) setStep(step + 1)
    else publish()
  }
  const back = () => {
    if (step > 1) setStep(step - 1)
    else onBack()
  }

  return (
    <div className="flex flex-col h-full bg-carbon relative">
      <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-carbon z-10 sticky top-0">
        <button onClick={back} className="w-10 h-10 rounded-full bg-superficie flex items-center justify-center text-crema">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-1.5 rounded-full ${i === step ? 'w-6 bg-naranja' : i < step ? 'w-2 bg-verde' : 'w-2 bg-superficie'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-32">
        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl text-crema mb-2">ELIGE LA CANCHA</h1>
            <p className="text-gris mb-6">El precio mostrado es por persona, por hora.</p>
            <div className="space-y-3">
              {Object.values(FIELDS).map((f) => (
                <div key={f.id} onClick={() => selectField(f.id)} className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-colors ${fieldId === f.id ? 'border-naranja bg-naranja/10' : 'border-superficie bg-superficie'}`}>
                  <img src={f.photoUrl} className="w-16 h-16 rounded-lg object-cover" alt={f.name} />
                  <div className="flex-1 min-w-0">
                    <div className="text-crema font-medium truncate">{f.name}</div>
                    <div className="text-xs text-gris flex items-center gap-1 mt-1"><MapPin size={12} /> {f.barrio}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-display bg-carbon text-crema px-2 py-0.5 rounded">{FORMAT_LABEL[f.format]}</span>
                      <span className="text-[11px] text-verde font-semibold">{money(perHourPerson(f.id))}/persona la hora</span>
                    </div>
                  </div>
                  {fieldId === f.id && (<div className="w-6 h-6 rounded-full bg-naranja flex items-center justify-center shrink-0"><Check size={14} className="text-carbon" strokeWidth={3} /></div>)}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl text-crema mb-2">FECHA Y HORA</h1>
            <p className="text-gris mb-5">Elige el día y verás las horas libres de <span className="text-crema">{field.name}</span>.</p>
            <label className="text-sm text-gris mb-2 block">Fecha</label>
            <input type="date" value={date} onChange={(e) => onDate(e.target.value)} className="w-full bg-superficie border border-white/10 rounded-xl px-4 py-4 text-crema outline-none focus:border-naranja transition-colors [color-scheme:dark] mb-6" />
            {!date ? (
              <div className="text-center text-gris text-sm bg-superficie/50 border border-white/5 rounded-xl py-8 px-4">
                <Clock size={28} className="mx-auto mb-2 opacity-50" />
                Elige una fecha para ver las horas disponibles.
              </div>
            ) : (
              <>
                <label className="text-sm text-gris mb-2 block">Horas disponibles · puedes elegir varias</label>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {field.hours.map((hh) => {
                    const taken = takenSet.has(hh)
                    const on = hours.includes(hh)
                    return (
                      <button key={hh} onClick={() => toggleHour(hh)} disabled={taken} className={`py-3 rounded-xl text-sm border-2 transition-all ${taken ? 'border-transparent bg-carbon text-gris/40 line-through cursor-not-allowed' : on ? 'border-verde bg-verde text-carbon font-semibold' : 'border-superficie bg-superficie text-crema'}`}>
                        {hh}{taken && <div className="text-[9px] no-underline">Ocupada</div>}
                      </button>
                    )
                  })}
                </div>
                {hours.length > 0 && (
                  <div className="bg-superficie rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gris">{hours.length} hora{hours.length === 1 ? '' : 's'} · {FORMAT_LABEL[field.format]}</div>
                      <div className="text-crema font-medium text-sm">Valor por hora / persona</div>
                    </div>
                    <div className="text-verde font-display text-2xl">{money(valorHora)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl text-crema mb-6">RESUMEN</h1>
            <div className="bg-superficie rounded-2xl overflow-hidden border border-white/5 mb-4">
              <img src={field.photoUrl} className="w-full h-28 object-cover" alt={field.name} />
              <div className="p-4">
                <h3 className="font-display text-xl text-crema">{field.name}</h3>
                <div className="text-sm text-gris mt-1">{FORMAT_LABEL[field.format]} · {date || 'Sin fecha'}</div>
                <div className="text-sm text-crema mt-1">{hours.length ? hours.join(' · ') : 'Sin horas'}</div>
              </div>
            </div>

            <p className="text-xs text-gris uppercase tracking-wider mb-2">Visibilidad</p>
            <div className="flex gap-2 mb-5">
              <button onClick={() => setVisibility('publico')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${visibility === 'publico' ? 'border-verde bg-verde/10 text-crema' : 'border-superficie bg-superficie text-gris'}`}>
                <Globe size={16} /> Público
              </button>
              <button onClick={() => setVisibility('privado')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all ${visibility === 'privado' ? 'border-naranja bg-naranja/10 text-crema' : 'border-superficie bg-superficie text-gris'}`}>
                <Lock size={16} /> Privado
              </button>
            </div>
            <p className="text-xs text-gris mb-5">{visibility === 'publico' ? 'Cualquiera puede encontrar y unirse a este picao.' : 'Solo quien tenga el ID o tu invitación podrá unirse.'}</p>

            <div className="bg-superficie rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="text-crema font-display">VALOR POR HORA</div>
                <div className="text-xs text-gris">por persona</div>
              </div>
              <div className="text-verde font-display text-3xl">{money(valorHora)}</div>
            </div>
            {hours.length > 1 && (
              <p className="text-xs text-gris text-center mt-3">Tu total por las {hours.length} horas: <span className="text-crema font-semibold">{money(totalPersona)}</span></p>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-carbon border-t border-white/5 p-5 pb-8 z-20">
        <button onClick={next} disabled={!canNext} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100">
          {step === 3 ? 'PUBLICAR Y PAGAR' : 'SIGUIENTE'}<ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
