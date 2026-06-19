'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check } from 'lucide-react'
import type { Zona } from '../lib/supabase/types'
import type { PerfilDatos } from '../lib/auth'
import {
  FORMATOS,
  ZONAS,
  posicionesPorFormato,
  type FormatoId,
  type PosicionCatalogo,
} from '../data/posiciones'

const Field = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) => (
  <div>
    <label className="text-sm text-gris mb-2 block">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-superficie border border-white/10 rounded-xl px-4 py-4 text-crema font-medium outline-none focus:border-naranja transition-colors ${type === 'date' ? '[color-scheme:dark]' : ''}`}
    />
  </div>
)

const Pitch = ({
  positions,
  selected,
  zonas,
  onToggle,
}: {
  positions: PosicionCatalogo[]
  selected: string[]
  zonas: Zona[]
  onToggle: (codigo: string) => void
}) => (
  <div
    className="relative w-full rounded-2xl overflow-hidden border border-verde/20"
    style={{ height: 360, background: 'linear-gradient(180deg,#1c3b2b 0%,#142a1f 100%)' }}
  >
    <div className="absolute inset-3 border border-verde/25 rounded-lg" />
    <div className="absolute left-3 right-3 top-1/2 h-px bg-verde/25" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-verde/25 rounded-full" />
    <div className="absolute left-1/2 -translate-x-1/2 top-3 w-32 h-10 border border-verde/25 border-t-0 rounded-b-lg" />
    <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-32 h-10 border border-verde/25 border-b-0 rounded-t-lg" />
    {positions.map((p) => {
      const on = selected.includes(p.codigo)
      const enZona = zonas.includes(p.zona)
      const dim = !on && !enZona
      return (
        <button
          key={p.codigo}
          onClick={() => onToggle(p.codigo)}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 z-10 transition-opacity ${dim ? 'opacity-35' : 'opacity-100'}`}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-display border-2 transition-all ${on ? 'bg-verde text-carbon border-verde scale-110 shadow-lg shadow-verde/30' : 'bg-carbon/80 text-crema border-crema/40'}`}>
            {p.abbr}
          </div>
          <span className={`text-[8px] leading-none whitespace-nowrap ${on ? 'text-verde font-bold' : 'text-crema/60'}`}>
            {p.label}
          </span>
        </button>
      )
    })}
  </div>
)

const emptyPorFormato = (): Record<FormatoId, string[]> => ({
  FUTBOL5: [],
  FUTBOL7: [],
  FUTBOL8: [],
  FUTBOL11: [],
})

export const Register = ({
  onBack,
  onSubmit,
  guardando,
}: {
  onBack: () => void
  onSubmit: (datos: PerfilDatos) => void
  guardando?: boolean
}) => {
  const [step, setStep] = useState(0)
  const [cedula, setCedula] = useState('')
  const [apodo, setApodo] = useState('')
  const [fecha, setFecha] = useState('')
  const [telefono, setTelefono] = useState('')
  const [zonas, setZonas] = useState<Zona[]>([])
  const [formato, setFormato] = useState<FormatoId>('FUTBOL5')
  const [posiciones, setPosiciones] = useState<Record<FormatoId, string[]>>(emptyPorFormato)

  const apodoValid = apodo.trim().length >= 3
  const cedulaOk = cedula.replace(/\D/g, '').length >= 6
  const phoneOk = telefono.replace(/\D/g, '').length >= 7

  const back = () => {
    if (step === 0) onBack()
    else setStep(step - 1)
  }
  const datosOk = cedulaOk && apodoValid && fecha && phoneOk
  const zonasOk = zonas.length >= 2
  const formatoDone = (id: FormatoId) => posiciones[id].length >= 2
  const todoOk = FORMATOS.every((f) => formatoDone(f.id))

  const toggleZona = (id: Zona) =>
    setZonas((prev) => (prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id]))
  const togglePos = (codigo: string) =>
    setPosiciones((prev) => {
      const cur = prev[formato]
      const next = cur.includes(codigo) ? cur.filter((p) => p !== codigo) : [...cur, codigo]
      return { ...prev, [formato]: next }
    })

  const delFormato = posicionesPorFormato(formato)
  const allCodigos = delFormato.map((p) => p.codigo)
  const allSelected = allCodigos.every((c) => posiciones[formato].includes(c))
  const toggleAll = () =>
    setPosiciones((prev) => ({ ...prev, [formato]: allSelected ? [] : allCodigos }))

  const curCount = posiciones[formato].length

  const crear = () => {
    if (!todoOk || guardando) return
    const todasPosiciones = Object.values(posiciones).flat()
    onSubmit({
      cedula: cedula.replace(/\D/g, ''),
      apodo: apodo.trim(),
      telefono: telefono.trim(),
      fecha_nacimiento: fecha,
      zonas,
      posiciones: todasPosiciones,
    })
  }

  return (
    <div className="flex flex-col h-full bg-carbon pt-16">
      <div className="px-6 flex items-center gap-4 mb-2">
        <button onClick={back} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-crema">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2 flex-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? 'bg-naranja' : 'bg-superficie'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="datos" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-1 flex flex-col px-6 overflow-y-auto pb-6 hide-scrollbar">
            <h1 className="font-display text-2xl text-crema mb-2 mt-6">ARMA TU PERFIL</h1>
            <p className="text-gris mb-6">Ya estás dentro. Cuéntanos quién eres para armar tu perfil.</p>
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm text-gris mb-2 block">Cédula</label>
                <input
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  inputMode="numeric"
                  placeholder="Ej. 1001234567"
                  className={`w-full bg-superficie border rounded-xl px-4 py-4 text-crema font-medium outline-none transition-colors ${cedula.trim().length === 0 ? 'border-white/10 focus:border-naranja' : cedulaOk ? 'border-verde' : 'border-white/10'}`}
                />
                {cedula.trim().length > 0 && !cedulaOk && (
                  <p className="text-xs mt-1.5 text-gris">Mínimo 6 dígitos</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gris mb-2 block">Nickname</label>
                <input
                  value={apodo}
                  onChange={(e) => setApodo(e.target.value)}
                  placeholder="Ej. ElPibe10"
                  className={`w-full bg-superficie border rounded-xl px-4 py-4 text-crema font-medium outline-none transition-colors ${apodo.trim().length === 0 ? 'border-white/10 focus:border-naranja' : apodoValid ? 'border-verde' : 'border-white/10'}`}
                />
                {apodo.trim().length > 0 && !apodoValid && (
                  <p className="text-xs mt-1.5 text-gris">Mínimo 3 caracteres</p>
                )}
              </div>
              <Field label="Fecha de nacimiento" placeholder="" value={fecha} onChange={setFecha} type="date" />
              <Field label="Teléfono" placeholder="300 000 0000" value={telefono} onChange={setTelefono} type="tel" />
            </div>
            <button onClick={() => setStep(1)} disabled={!datosOk} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mt-6 mb-8">
              SIGUIENTE
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="zona" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-1 flex flex-col px-6">
            <h1 className="font-display text-2xl text-crema mb-2 mt-6">¿EN QUÉ ZONAS JUEGAS?</h1>
            <p className="text-gris mb-6">Elige <span className="text-verde font-semibold">2 o más</span>. Resaltarán tus posiciones más adelante.</p>
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {ZONAS.map((z) => {
                const on = zonas.includes(z.id)
                return (
                  <button key={z.id} onClick={() => toggleZona(z.id)} className={`relative text-left p-4 rounded-2xl border transition-all ${on ? 'bg-verde/10 border-verde' : 'bg-superficie border-white/5'}`}>
                    {on && (<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-verde flex items-center justify-center"><Check size={13} className="text-carbon" strokeWidth={3} /></div>)}
                    <div className="text-3xl mb-2">{z.emoji}</div>
                    <div className="font-display text-crema text-lg">{z.label.toUpperCase()}</div>
                    <div className="text-xs text-gris mt-1">{z.desc}</div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gris text-center mt-4">{zonas.length} seleccionada{zonas.length === 1 ? '' : 's'}</p>
            <button onClick={() => setStep(2)} disabled={!zonasOk} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mt-3 mb-8">SIGUIENTE</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="pos" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-1 flex flex-col px-6 overflow-y-auto pb-8 hide-scrollbar">
            <h1 className="font-display text-2xl text-crema mb-2 mt-6">TUS POSICIONES</h1>
            <p className="text-gris mb-4">Tus zonas salen <span className="text-verde font-semibold">resaltadas</span>; las demás, atenuadas. Mínimo <span className="text-verde font-semibold">2</span> por formato.</p>
            <div className="flex gap-2 bg-superficie p-1 rounded-xl mb-3">
              {FORMATOS.map((f) => {
                const done = formatoDone(f.id)
                return (
                  <button key={f.id} onClick={() => setFormato(f.id)} className={`flex-1 py-2.5 rounded-lg text-[11px] font-display transition-all flex items-center justify-center gap-1 ${formato === f.id ? 'bg-naranja text-carbon' : done ? 'text-verde' : 'text-gris'}`}>
                    {f.label}{done && <Check size={12} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gris">Toca los puntos para elegir</span>
              <button onClick={toggleAll} className="text-[11px] font-display tracking-wide text-verde px-3 py-1.5 rounded-lg border border-verde/30 active:scale-95 transition-transform">{allSelected ? 'QUITAR TODAS' : 'SELECCIONAR TODAS'}</button>
            </div>
            <Pitch positions={delFormato} selected={posiciones[formato]} zonas={zonas} onToggle={togglePos} />
            <div className="flex items-center justify-between mt-3">
              <span className={`text-sm font-medium ${curCount >= 2 ? 'text-verde' : 'text-gris'}`}>{curCount} elegida{curCount === 1 ? '' : 's'} {curCount < 2 && `(faltan ${2 - curCount})`}</span>
              <span className="text-xs text-gris">{FORMATOS.filter((f) => formatoDone(f.id)).length}/{FORMATOS.length} formatos listos</span>
            </div>
            <button onClick={crear} disabled={!todoOk || guardando} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mt-4 flex items-center justify-center gap-2">{todoOk ? (guardando ? 'GUARDANDO…' : 'EMPEZAR A JUGAR') : `COMPLETA LOS ${FORMATOS.length} FORMATOS`}{todoOk && !guardando && <Check size={20} />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
