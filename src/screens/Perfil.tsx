'use client'

import React, { useState } from 'react'
import { Pencil, Check, Star, Trophy, Activity, MapPin, Mail, Phone, Cake } from 'lucide-react'

const ZONAS = [
  { id: 'portero', label: 'Portero' },
  { id: 'defensa', label: 'Defensa' },
  { id: 'medio', label: 'Medio' },
  { id: 'ataque', label: 'Ataque' },
]
const NIVELES = ['Principiante', 'Intermedio', 'Avanzado']
const FMT: Record<string, string> = { '5v5': 'Fútbol 5', '7v7': 'Fútbol 7', '11v11': 'Fútbol 11' }
const POSICIONES: Record<string, string[]> = {
  '5v5': ['Portero', 'Cierre', 'Ala Izq.', 'Ala Der.', 'Pívot'],
  '7v7': ['Portero', 'Lateral Izq.', 'Defensa', 'Lateral Der.', 'Medio Centro', 'Extremo Izq.', 'Extremo Der.', 'Delantero'],
  '11v11': ['Portero', 'Lat. Izq.', 'Central', 'Lat. Der.', 'Mediocentro Def.', 'Mediocentro', 'Mediapunta', 'Extremo Izq.', 'Extremo Der.', 'Delantero'],
}

const toggle = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

export const Perfil = () => {
  const [editing, setEditing] = useState(false)
  const [p, setP] = useState({
    nickname: 'ElPibe10',
    correo: 'elpibe@mail.com',
    telefono: '300 123 4567',
    fecha: '2000-05-12',
    barrio: 'Bocagrande',
    nivel: 'Intermedio',
    zonas: ['medio', 'ataque'] as string[],
    posiciones: {
      '5v5': ['Ala Der.', 'Pívot'],
      '7v7': ['Medio Centro', 'Extremo Der.'],
      '11v11': ['Mediapunta', 'Delantero'],
    } as Record<string, string[]>,
  })
  const set = (patch: Partial<typeof p>) => setP((prev) => ({ ...prev, ...patch }))
  const togglePos = (fmt: string, pos: string) =>
    setP((prev) => ({
      ...prev,
      posiciones: { ...prev.posiciones, [fmt]: toggle(prev.posiciones[fmt], pos) },
    }))

  return (
    <div className="flex flex-col h-full bg-carbon relative pb-20">
      <div className="px-5 pt-12 pb-4 flex justify-between items-center bg-carbon z-10 sticky top-0">
        <h1 className="font-display text-2xl text-crema">PERFIL</h1>
        <button
          onClick={() => setEditing((e) => !e)}
          className={`flex items-center gap-1 ${editing ? 'text-verde font-display text-sm' : 'text-crema'}`}
        >
          {editing ? (<><Check size={18} /> GUARDAR</>) : <Pencil size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-6">
        {/* Avatar + nickname */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-superficie object-cover" />
            {editing && (
              <div className="absolute inset-0 rounded-full bg-carbon/60 flex items-center justify-center text-[10px] text-crema font-medium">Cambiar</div>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={p.nickname} onChange={(e) => set({ nickname: e.target.value })} className="w-full bg-superficie border border-white/10 rounded-lg px-3 py-2 text-crema font-display text-xl outline-none focus:border-naranja mb-2" />
            ) : (
              <h2 className="font-display text-2xl text-crema">{p.nickname}</h2>
            )}
            <div className="flex items-center gap-1 text-gris text-sm mb-2"><MapPin size={14} /> {p.barrio}</div>
            {editing ? (
              <div className="flex gap-1">
                {NIVELES.map((n) => (
                  <button key={n} onClick={() => set({ nivel: n })} className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${p.nivel === n ? 'bg-naranja text-carbon' : 'bg-superficie text-gris'}`}>{n}</button>
                ))}
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 bg-naranja/20 text-naranja text-xs font-bold uppercase rounded">{p.nivel}</div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Star className="text-naranja mb-1" size={20} />
            <div className="font-display text-xl text-crema">4.9</div>
            <div className="text-[10px] text-gris uppercase">Rating</div>
          </div>
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Activity className="text-verde mb-1" size={20} />
            <div className="font-display text-xl text-crema">24</div>
            <div className="text-[10px] text-gris uppercase">Jugados</div>
          </div>
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Trophy className="text-magenta mb-1" size={20} />
            <div className="font-display text-xl text-crema">98%</div>
            <div className="text-[10px] text-gris uppercase">Asistencia</div>
          </div>
        </div>

        {/* Datos de la cuenta */}
        <h3 className="font-display text-lg text-crema mb-3">DATOS DE LA CUENTA</h3>
        <div className="space-y-3 mb-8">
          <InfoRow icon={<Mail size={14} />} label="Correo" value={p.correo} editing={editing} type="email" onChange={(v) => set({ correo: v })} />
          <InfoRow icon={<Phone size={14} />} label="Teléfono" value={p.telefono} editing={editing} type="tel" onChange={(v) => set({ telefono: v })} />
          <InfoRow icon={<Cake size={14} />} label="Fecha de nacimiento" value={p.fecha} editing={editing} type="date" onChange={(v) => set({ fecha: v })} />
          <InfoRow icon={<MapPin size={14} />} label="Barrio" value={p.barrio} editing={editing} onChange={(v) => set({ barrio: v })} />
        </div>

        {/* Zonas */}
        <h3 className="font-display text-lg text-crema mb-3">ZONAS</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {(editing ? ZONAS : ZONAS.filter((z) => p.zonas.includes(z.id))).map((z) => {
            const on = p.zonas.includes(z.id)
            return (
              <button
                key={z.id}
                disabled={!editing}
                onClick={() => set({ zonas: toggle(p.zonas, z.id) })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${on ? 'bg-verde/10 border-verde text-verde' : 'bg-superficie border-white/10 text-gris'}`}
              >
                {z.label}
              </button>
            )
          })}
          {!editing && p.zonas.length === 0 && <span className="text-gris text-sm">Sin zonas</span>}
        </div>

        {/* Posiciones por formato */}
        <h3 className="font-display text-lg text-crema mb-3">POSICIONES</h3>
        <div className="space-y-4 mb-8">
          {(['5v5', '7v7', '11v11'] as const).map((fmt) => {
            const sel = p.posiciones[fmt]
            const list = editing ? POSICIONES[fmt] : sel
            return (
              <div key={fmt}>
                <p className="text-xs text-gris uppercase tracking-wider mb-2">{FMT[fmt]}</p>
                <div className="flex flex-wrap gap-2">
                  {list.length === 0 && !editing && <span className="text-gris text-sm">Sin posiciones</span>}
                  {list.map((pos) => {
                    const on = sel.includes(pos)
                    return (
                      <button
                        key={pos}
                        disabled={!editing}
                        onClick={() => togglePos(fmt, pos)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${on ? 'bg-verde text-carbon border-verde' : 'bg-superficie text-crema border-white/10'}`}
                      >
                        {pos}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Insignias */}
        <h3 className="font-display text-lg text-crema mb-4">INSIGNIAS</h3>
        <div className="space-y-3">
          {[
            { title: 'Goleador', desc: 'Marcó en 5 picaos seguidos', icon: '⚽' },
            { title: 'Siempre Llega', desc: '100% asistencia este mes', icon: '⏱️' },
            { title: 'Rescatista', desc: 'Salvó 3 picaos a última hora', icon: '🚑' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-4 bg-superficie p-4 rounded-xl border border-white/5">
              <div className="w-12 h-12 bg-carbon rounded-full flex items-center justify-center text-2xl border border-white/10">{b.icon}</div>
              <div>
                <div className="text-crema font-medium">{b.title}</div>
                <div className="text-xs text-gris">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({
  icon,
  label,
  value,
  editing,
  onChange,
  type = 'text',
}: {
  icon: React.ReactNode
  label: string
  value: string
  editing: boolean
  onChange: (v: string) => void
  type?: string
}) => (
  <div className="bg-superficie rounded-xl p-4 border border-white/5">
    <div className="flex items-center gap-2 text-xs text-gris mb-1.5">{icon} {label}</div>
    {editing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-carbon border border-white/10 rounded-lg px-3 py-2.5 text-crema font-medium text-sm outline-none focus:border-naranja ${type === 'date' ? '[color-scheme:dark]' : ''}`}
      />
    ) : (
      <div className="text-crema font-medium">{value}</div>
    )}
  </div>
)
