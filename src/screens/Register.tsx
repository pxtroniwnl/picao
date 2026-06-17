'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check } from 'lucide-react'

const NICK_TAKEN = ['elpibe', 'kevin', 'lucho', 'picao', 'admin', 'cartagena']

const ZONAS = [
  { id: 'portero', label: 'Portero', emoji: '🧤', desc: 'Bajo los tres palos' },
  { id: 'defensa', label: 'Defensa', emoji: '🛡️', desc: 'Atrás, cortando' },
  { id: 'medio', label: 'Medio', emoji: '⚙️', desc: 'El motor del equipo' },
  { id: 'ataque', label: 'Ataque', emoji: '🎯', desc: 'Arriba, al gol' },
]

const FORMATOS = [
  { id: 'futbol5', label: 'Fútbol 5' },
  { id: 'futbol7', label: 'Fútbol 7' },
  { id: 'futbol11', label: 'Fútbol 11' },
]

type Pos = { id: string; label: string; abbr: string; x: number; y: number; z: string[] }

const PITCH: Record<string, Pos[]> = {
  futbol5: [
    { id: 'f5_por', label: 'Portero', abbr: 'POR', x: 50, y: 88, z: ['portero'] },
    { id: 'f5_cie', label: 'Cierre', abbr: 'CIE', x: 50, y: 68, z: ['defensa'] },
    { id: 'f5_ali', label: 'Ala Izq.', abbr: 'ALI', x: 22, y: 46, z: ['medio', 'ataque'] },
    { id: 'f5_ald', label: 'Ala Der.', abbr: 'ALD', x: 78, y: 46, z: ['medio', 'ataque'] },
    { id: 'f5_piv', label: 'Pívot', abbr: 'PIV', x: 50, y: 22, z: ['ataque'] },
  ],
  futbol7: [
    { id: 'f7_por', label: 'Portero', abbr: 'POR', x: 50, y: 90, z: ['portero'] },
    { id: 'f7_li', label: 'Lateral Izq.', abbr: 'LI', x: 18, y: 72, z: ['defensa'] },
    { id: 'f7_dfc', label: 'Defensa', abbr: 'DFC', x: 50, y: 75, z: ['defensa'] },
    { id: 'f7_ld', label: 'Lateral Der.', abbr: 'LD', x: 82, y: 72, z: ['defensa'] },
    { id: 'f7_mc', label: 'Medio Centro', abbr: 'MC', x: 50, y: 50, z: ['medio'] },
    { id: 'f7_ei', label: 'Extremo Izq.', abbr: 'EI', x: 22, y: 30, z: ['medio', 'ataque'] },
    { id: 'f7_ed', label: 'Extremo Der.', abbr: 'ED', x: 78, y: 30, z: ['medio', 'ataque'] },
    { id: 'f7_del', label: 'Delantero', abbr: 'DEL', x: 50, y: 14, z: ['ataque'] },
  ],
  futbol11: [
    { id: 'f11_por', label: 'Portero', abbr: 'POR', x: 50, y: 92, z: ['portero'] },
    { id: 'f11_li', label: 'Lat. Izq.', abbr: 'LI', x: 14, y: 77, z: ['defensa'] },
    { id: 'f11_cti', label: 'Central Izq.', abbr: 'DFC', x: 37, y: 81, z: ['defensa'] },
    { id: 'f11_ctd', label: 'Central Der.', abbr: 'DFC', x: 63, y: 81, z: ['defensa'] },
    { id: 'f11_ld', label: 'Lat. Der.', abbr: 'LD', x: 86, y: 77, z: ['defensa'] },
    { id: 'f11_mcd', label: 'Mediocentro Def.', abbr: 'MCD', x: 50, y: 64, z: ['medio'] },
    { id: 'f11_ini', label: 'Mediocentro', abbr: 'MC', x: 28, y: 51, z: ['medio'] },
    { id: 'f11_ind', label: 'Mediocentro', abbr: 'MC', x: 72, y: 51, z: ['medio'] },
    { id: 'f11_mp', label: 'Mediapunta', abbr: 'MP', x: 50, y: 38, z: ['medio', 'ataque'] },
    { id: 'f11_ei', label: 'Extremo Izq.', abbr: 'EI', x: 16, y: 27, z: ['medio', 'ataque'] },
    { id: 'f11_ed', label: 'Extremo Der.', abbr: 'ED', x: 84, y: 27, z: ['medio', 'ataque'] },
    { id: 'f11_dc', label: 'Delantero', abbr: 'DC', x: 50, y: 13, z: ['ataque'] },
  ],
}

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
  positions: Pos[]
  selected: string[]
  zonas: string[]
  onToggle: (id: string) => void
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
      const on = selected.includes(p.id)
      const enZona = p.z.some((zz) => zonas.includes(zz))
      const dim = !on && !enZona
      return (
        <button
          key={p.id}
          onClick={() => onToggle(p.id)}
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

export const Register = ({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: () => void
}) => {
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState('')
  const [fecha, setFecha] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [zonas, setZonas] = useState<string[]>([])
  const [formato, setFormato] = useState('futbol5')
  const [posiciones, setPosiciones] = useState<Record<string, string[]>>({
    futbol5: [],
    futbol7: [],
    futbol11: [],
  })

  const nickClean = nickname.trim().toLowerCase()
  const nickTaken = NICK_TAKEN.includes(nickClean)
  const nickValid = nickClean.length >= 3 && !nickTaken
  const emailOk = /\S+@\S+\.\S+/.test(correo)
  const phoneOk = telefono.replace(/\D/g, '').length >= 7

  const back = () => {
    if (step === 0) onBack()
    else setStep(step - 1)
  }
  const datosOk = nickValid && fecha && emailOk && phoneOk && password.length >= 4
  const zonasOk = zonas.length >= 2
  const formatoDone = (id: string) => posiciones[id].length >= 2
  const todoOk = FORMATOS.every((f) => formatoDone(f.id))

  const toggleZona = (id: string) =>
    setZonas((prev) => (prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id]))
  const togglePos = (id: string) =>
    setPosiciones((prev) => {
      const cur = prev[formato]
      const next = cur.includes(id) ? cur.filter((p) => p !== id) : [...cur, id]
      return { ...prev, [formato]: next }
    })

  const allIds = PITCH[formato].map((p) => p.id)
  const allSelected = allIds.every((id) => posiciones[formato].includes(id))
  const toggleAll = () =>
    setPosiciones((prev) => ({ ...prev, [formato]: allSelected ? [] : allIds }))

  const curCount = posiciones[formato].length

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
            <h1 className="font-display text-2xl text-crema mb-2 mt-6">CREA TU CUENTA</h1>
            <p className="text-gris mb-6">Empecemos con lo básico.</p>
            <div className="space-y-4 flex-1">
              {/* Nickname con validación de unicidad */}
              <div>
                <label className="text-sm text-gris mb-2 block">
                  Nickname <span className="text-gris/60">(único)</span>
                </label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej. ElPibe10"
                  className={`w-full bg-superficie border rounded-xl px-4 py-4 text-crema font-medium outline-none transition-colors ${nickname.trim().length === 0 ? 'border-white/10 focus:border-naranja' : nickTaken ? 'border-magenta' : nickValid ? 'border-verde' : 'border-white/10'}`}
                />
                {nickname.trim().length > 0 && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1 ${nickTaken ? 'text-magenta' : nickValid ? 'text-verde' : 'text-gris'}`}>
                    {nickTaken ? 'Ese nickname ya está en uso' : nickValid ? (<><Check size={12} /> Disponible</>) : 'Mínimo 3 caracteres'}
                  </p>
                )}
              </div>
              <Field label="Fecha de nacimiento" placeholder="" value={fecha} onChange={setFecha} type="date" />
              <Field label="Correo" placeholder="tucorreo@mail.com" value={correo} onChange={setCorreo} type="email" />
              <Field label="Teléfono" placeholder="300 000 0000" value={telefono} onChange={setTelefono} type="tel" />
              <Field label="Contraseña" placeholder="Mínimo 4 caracteres" value={password} onChange={setPassword} type="password" />
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
                  <button key={f.id} onClick={() => setFormato(f.id)} className={`flex-1 py-2.5 rounded-lg text-xs font-display transition-all flex items-center justify-center gap-1 ${formato === f.id ? 'bg-naranja text-carbon' : done ? 'text-verde' : 'text-gris'}`}>
                    {f.label}{done && <Check size={13} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gris">Toca los puntos para elegir</span>
              <button onClick={toggleAll} className="text-[11px] font-display tracking-wide text-verde px-3 py-1.5 rounded-lg border border-verde/30 active:scale-95 transition-transform">{allSelected ? 'QUITAR TODAS' : 'SELECCIONAR TODAS'}</button>
            </div>
            <Pitch positions={PITCH[formato]} selected={posiciones[formato]} zonas={zonas} onToggle={togglePos} />
            <div className="flex items-center justify-between mt-3">
              <span className={`text-sm font-medium ${curCount >= 2 ? 'text-verde' : 'text-gris'}`}>{curCount} elegida{curCount === 1 ? '' : 's'} {curCount < 2 && `(faltan ${2 - curCount})`}</span>
              <span className="text-xs text-gris">{FORMATOS.filter((f) => formatoDone(f.id)).length}/3 formatos listos</span>
            </div>
            <button onClick={onComplete} disabled={!todoOk} className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 mt-4 flex items-center justify-center gap-2">{todoOk ? 'CREAR CUENTA' : 'COMPLETA LOS 3 FORMATOS'}{todoOk && <Check size={20} />}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
