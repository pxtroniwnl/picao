'use client'

import React, { useEffect, useState } from 'react'
import { Pencil, Check, Star, Trophy, Activity, Fingerprint, Mail, Phone, Cake, LogOut, Loader2 } from 'lucide-react'
import type { Zona } from '../lib/supabase/types'
import { obtenerPerfil, guardarPerfil, cerrarSesion, type PerfilDatos } from '../lib/auth'
import { FORMATOS, ZONAS, posicionesPorFormato } from '../data/posiciones'

const toggle = <T,>(arr: T[], v: T) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

const vacio: PerfilDatos = {
  cedula: '',
  apodo: '',
  telefono: '',
  email: '',
  fecha_nacimiento: '',
  zonas: [],
  posiciones: [],
}

export const Perfil = ({ onLogout }: { onLogout: () => void }) => {
  const [editing, setEditing] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [p, setP] = useState<PerfilDatos>(vacio)

  useEffect(() => {
    obtenerPerfil().then((perfil) => {
      if (perfil) setP({ ...vacio, ...perfil })
      setCargando(false)
    })
  }, [])

  const set = (patch: Partial<PerfilDatos>) => setP((prev) => ({ ...prev, ...patch }))
  const togglePos = (codigo: string) => set({ posiciones: toggle(p.posiciones, codigo) })

  const toggleEdit = async () => {
    if (editing) {
      setGuardando(true)
      await guardarPerfil(p)
      setGuardando(false)
    }
    setEditing((e) => !e)
  }

  const logout = async () => {
    await cerrarSesion()
    onLogout()
  }

  if (cargando) {
    return (
      <div className="flex flex-col h-full bg-carbon items-center justify-center">
        <Loader2 className="text-verde animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-carbon relative pb-20">
      <div className="px-5 pt-12 pb-4 flex justify-between items-center bg-carbon z-10 sticky top-0">
        <h1 className="font-display text-2xl text-crema">PERFIL</h1>
        <button
          onClick={toggleEdit}
          disabled={guardando}
          className={`flex items-center gap-1 ${editing ? 'text-verde font-display text-sm' : 'text-crema'}`}
        >
          {guardando ? <Loader2 size={18} className="animate-spin" /> : editing ? (<><Check size={18} /> GUARDAR</>) : <Pencil size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-6">
        {/* Avatar + nickname */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-superficie object-cover" />
            {editing && (
              <div className="absolute inset-0 rounded-full bg-carbon/60 flex items-center justify-center text-[10px] text-crema font-medium">Cambiar</div>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={p.apodo} onChange={(e) => set({ apodo: e.target.value })} className="w-full bg-superficie border border-white/10 rounded-lg px-3 py-2 text-crema font-display text-xl outline-none focus:border-naranja mb-2" />
            ) : (
              <h2 className="font-display text-2xl text-crema">{p.apodo || 'Sin nombre'}</h2>
            )}
            <div className="flex items-center gap-1 text-gris text-sm"><Fingerprint size={14} /> C.C. {p.cedula || '—'}</div>
          </div>
        </div>

        {/* Stats (placeholder hasta tener datos de picaos) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Star className="text-naranja mb-1" size={20} />
            <div className="font-display text-xl text-crema">—</div>
            <div className="text-[10px] text-gris uppercase">Rating</div>
          </div>
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Activity className="text-verde mb-1" size={20} />
            <div className="font-display text-xl text-crema">0</div>
            <div className="text-[10px] text-gris uppercase">Jugados</div>
          </div>
          <div className="bg-superficie rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5">
            <Trophy className="text-magenta mb-1" size={20} />
            <div className="font-display text-xl text-crema">—</div>
            <div className="text-[10px] text-gris uppercase">Asistencia</div>
          </div>
        </div>

        {/* Datos de la cuenta */}
        <h3 className="font-display text-lg text-crema mb-3">DATOS DE LA CUENTA</h3>
        <div className="space-y-3 mb-8">
          <InfoRow icon={<Mail size={14} />} label="Correo" value={p.email ?? ''} editing={editing} type="email" onChange={(v) => set({ email: v })} />
          <InfoRow icon={<Phone size={14} />} label="Teléfono" value={p.telefono ?? ''} editing={editing} type="tel" onChange={(v) => set({ telefono: v })} />
          <InfoRow icon={<Cake size={14} />} label="Fecha de nacimiento" value={p.fecha_nacimiento ?? ''} editing={editing} type="date" onChange={(v) => set({ fecha_nacimiento: v })} />
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
                onClick={() => set({ zonas: toggle<Zona>(p.zonas, z.id) })}
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
          {FORMATOS.map((f) => {
            const cat = posicionesPorFormato(f.id)
            const seleccionadas = cat.filter((pos) => p.posiciones.includes(pos.codigo))
            const lista = editing ? cat : seleccionadas
            return (
              <div key={f.id}>
                <p className="text-xs text-gris uppercase tracking-wider mb-2">{f.label}</p>
                <div className="flex flex-wrap gap-2">
                  {lista.length === 0 && !editing && <span className="text-gris text-sm">Sin posiciones</span>}
                  {lista.map((pos) => {
                    const on = p.posiciones.includes(pos.codigo)
                    return (
                      <button
                        key={pos.codigo}
                        disabled={!editing}
                        onClick={() => togglePos(pos.codigo)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${on ? 'bg-verde text-carbon border-verde' : 'bg-superficie text-crema border-white/10'}`}
                      >
                        {pos.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Insignias (placeholder) */}
        <h3 className="font-display text-lg text-crema mb-4">INSIGNIAS</h3>
        <div className="space-y-3 mb-8">
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

        {/* Cerrar sesión */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-magenta/40 text-magenta font-display text-sm active:scale-95 transition-transform"
        >
          <LogOut size={18} /> CERRAR SESIÓN
        </button>
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
      <div className="text-crema font-medium">{value || '—'}</div>
    )}
  </div>
)
