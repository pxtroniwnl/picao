'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Check, Clock, Globe, Lock, Loader2 } from 'lucide-react'
import { FORMAT_PLAYERS, FORMAT_LABEL, Picao } from '../data/picaos'
import { crearPicao, type Cancha } from '../lib/picaos'

const money = (n: number) => '$' + n.toLocaleString('es-CO')
const GANANCIA = 1250
const FORMATO_UI: Record<string, string> = {
  FUTBOL5: '5v5',
  FUTBOL7: '7v7',
  FUTBOL8: '8v8',
  FUTBOL11: '11v11',
}
const cuposDe = (c: Cancha) => FORMAT_PLAYERS[FORMATO_UI[c.formato_id]] ?? 10
const labelDe = (c: Cancha) => FORMAT_LABEL[FORMATO_UI[c.formato_id]] ?? c.formato_id
const valorPersona = (c: Cancha) => Math.round(c.precio_hora / cuposDe(c)) + GANANCIA

export const CrearPicao = ({
  canchas,
  onBack,
  onCreated,
}: {
  canchas: Cancha[]
  onBack: () => void
  onCreated: (p: Picao) => void
}) => {
  const [step, setStep] = useState(1)
  const [canchaId, setCanchaId] = useState<string>(canchas[0]?.id ?? '')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState<string[]>([])
  const [visibility, setVisibility] = useState<'publico' | 'privado'>('publico')
  const [creando, setCreando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancha = canchas.find((c) => c.id === canchaId)
  const valorHora = cancha ? valorPersona(cancha) : 0
  const totalPersona = valorHora * hours.length

  const selectCancha = (id: string) => {
    setCanchaId(id)
    setHours([])
  }
  const onDate = (d: string) => {
    setDate(d)
    setHours([])
  }
  const toggleHour = (hh: string) =>
    setHours((prev) => (prev.includes(hh) ? prev.filter((x) => x !== hh) : [...prev, hh]))

  const canNext = step === 1 ? !!cancha : step === 2 ? !!date && hours.length > 0 : true
  const publish = async () => {
    if (!cancha || creando) return
    setCreando(true)
    setError(null)
    const { picao, error } = await crearPicao({
      canchaId: cancha.id,
      fecha: date,
      horas: hours,
      visibilidad: visibility,
    })
    setCreando(false)
    if (error || !picao) {
      setError(error ?? 'No se pudo crear el picao.')
      return
    }
    onCreated(picao)
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
            {canchas.length === 0 ? (
              <div className="text-center text-gris text-sm bg-superficie/50 border border-white/5 rounded-xl py-8 px-4">
                No hay canchas disponibles todavía.
              </div>
            ) : (
              <div className="space-y-3">
                {canchas.map((c) => (
                  <div key={c.id} onClick={() => selectCancha(c.id)} className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-colors ${canchaId === c.id ? 'border-naranja bg-naranja/10' : 'border-superficie bg-superficie'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.foto_url ?? ''} className="w-16 h-16 rounded-lg object-cover bg-carbon" alt={c.nombre} />
                    <div className="flex-1 min-w-0">
                      <div className="text-crema font-medium truncate">{c.nombre}</div>
                      <div className="text-xs text-gris flex items-center gap-1 mt-1"><MapPin size={12} /> {c.barrio}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-display bg-carbon text-crema px-2 py-0.5 rounded">{labelDe(c)}</span>
                        <span className="text-[11px] text-verde font-semibold">{money(valorPersona(c))}/persona la hora</span>
                      </div>
                    </div>
                    {canchaId === c.id && (<div className="w-6 h-6 rounded-full bg-naranja flex items-center justify-center shrink-0"><Check size={14} className="text-carbon" strokeWidth={3} /></div>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && cancha && (
          <div>
            <h1 className="font-display text-2xl text-crema mb-2">FECHA Y HORA</h1>
            <p className="text-gris mb-5">Elige el día y las horas en <span className="text-crema">{cancha.nombre}</span>.</p>
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
                  {cancha.horas.map((hh) => {
                    const on = hours.includes(hh)
                    return (
                      <button key={hh} onClick={() => toggleHour(hh)} className={`py-3 rounded-xl text-sm border-2 transition-all ${on ? 'border-verde bg-verde text-carbon font-semibold' : 'border-superficie bg-superficie text-crema'}`}>
                        {hh}
                      </button>
                    )
                  })}
                </div>
                {hours.length > 0 && (
                  <div className="bg-superficie rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gris">{hours.length} hora{hours.length === 1 ? '' : 's'} · {labelDe(cancha)}</div>
                      <div className="text-crema font-medium text-sm">Valor por hora / persona</div>
                    </div>
                    <div className="text-verde font-display text-2xl">{money(valorHora)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && cancha && (
          <div>
            <h1 className="font-display text-2xl text-crema mb-6">RESUMEN</h1>
            <div className="bg-superficie rounded-2xl overflow-hidden border border-white/5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cancha.foto_url ?? ''} className="w-full h-28 object-cover bg-carbon" alt={cancha.nombre} />
              <div className="p-4">
                <h3 className="font-display text-xl text-crema">{cancha.nombre}</h3>
                <div className="text-sm text-gris mt-1">{labelDe(cancha)} · {date || 'Sin fecha'}</div>
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
            <p className="text-xs text-gris mb-5">{visibility === 'publico' ? 'Cualquiera puede encontrar y unirse a este picao.' : 'Solo quien tenga el código PCO podrá encontrarlo.'}</p>

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
            {error && <p className="text-magenta text-sm text-center mt-4">{error}</p>}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-carbon border-t border-white/5 p-5 pb-8 z-20">
        <button onClick={next} disabled={!canNext || creando} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100">
          {creando ? <Loader2 size={20} className="animate-spin" /> : (<>{step === 3 ? 'PUBLICAR' : 'SIGUIENTE'}<ChevronRight size={20} /></>)}
        </button>
      </div>
    </div>
  )
}
