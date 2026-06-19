'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Filter, Plus, X, Check, Search, Navigation, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo, FieldCard } from '../components/Shared'
import { FIELDS, Picao } from '../data/picaos'
import { buscarPorCodigo } from '../lib/picaos'

const FORMATOS = [
  { id: 'todos', label: 'Todos' },
  { id: '5v5', label: 'Fútbol 5' },
  { id: '7v7', label: 'Fútbol 7' },
  { id: '8v8', label: 'Fútbol 8' },
  { id: '11v11', label: 'Fútbol 11' },
]

const nombreCancha = (p: Picao) => p.canchaNombre ?? FIELDS[p.fieldId]?.name ?? 'Cancha'
const barrioCancha = (p: Picao) => p.barrio ?? FIELDS[p.fieldId]?.barrio ?? ''

export const Home = ({
  picaos,
  onSelectPicao,
  onNotifications,
  onCrear,
}: {
  picaos: Picao[]
  onSelectPicao: (p: Picao) => void
  onNotifications: () => void
  onCrear: () => void
}) => {
  const [query, setQuery] = useState('')
  const [formato, setFormato] = useState('todos')
  const [fecha, setFecha] = useState('todas')
  const [cancha, setCancha] = useState('todas')
  const [sheet, setSheet] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [located, setLocated] = useState(false)
  const [locating, setLocating] = useState(false)
  const [porCodigo, setPorCodigo] = useState<Picao | null>(null)

  const abiertos = picaos.filter((p) => p.status === 'abierto')
  const fechas = ['todas', ...Array.from(new Set(abiertos.map((p) => p.date)))]
  const canchas = ['todas', ...Array.from(new Set(abiertos.map((p) => p.fieldId)))]
  const nombrePorId: Record<string, string> = {}
  for (const p of abiertos) nombrePorId[p.fieldId] = nombreCancha(p)

  const q = query.trim().toLowerCase()
  const matchesQuery = (p: Picao) => {
    if (!q) return true
    return [p.code, nombreCancha(p), barrioCancha(p), p.date, p.time, p.format].some((s) =>
      s.toLowerCase().includes(q),
    )
  }
  const filtered = abiertos.filter(
    (p) =>
      matchesQuery(p) &&
      (formato === 'todos' || p.format === formato) &&
      (fecha === 'todas' || p.date === fecha) &&
      (cancha === 'todas' || p.fieldId === cancha),
  )

  // Búsqueda por código PCO: encuentra también privados (vía función SECURITY DEFINER).
  useEffect(() => {
    const raw = query.trim()
    const m = raw.match(/^(?:pco-?)?(\d{4})$/i)
    if (!m) {
      setPorCodigo(null)
      return
    }
    let activo = true
    buscarPorCodigo(`PCO-${m[1]}`).then((p) => {
      if (activo) setPorCodigo(p)
    })
    return () => {
      activo = false
    }
  }, [query])

  const extra = porCodigo && !filtered.some((p) => p.id === porCodigo.id) ? porCodigo : null

  const activeCount = (fecha !== 'todas' ? 1 : 0) + (cancha !== 'todas' ? 1 : 0)
  const clearAll = () => {
    setFecha('todas')
    setCancha('todas')
  }

  const nearby = [...abiertos].sort((a, b) => a.distanceKm - b.distanceKm)
  const activarUbicacion = () => {
    setLocating(true)
    setTimeout(() => {
      setLocating(false)
      setLocated(true)
    }, 1200)
  }
  const goToPicao = (p: Picao) => {
    setMapOpen(false)
    onSelectPicao(p)
  }

  return (
    <div className="flex flex-col h-full bg-carbon relative pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex items-center justify-between bg-carbon z-10 sticky top-0">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-crema text-sm font-medium">
            Cartagena <span className="text-xs">▼</span>
          </div>
          <button onClick={onNotifications} className="relative text-crema">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-magenta rounded-full border-2 border-carbon"></span>
          </button>
          <button
            onClick={() => setSheet(true)}
            className="relative w-10 h-10 rounded-full bg-superficie flex items-center justify-center text-crema"
          >
            <Filter size={18} />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-verde text-carbon text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="px-5 mb-4">
          <h1 className="font-display text-3xl text-crema mt-2 mb-4">
            PICAOS ABIERTOS
          </h1>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-superficie border border-white/10 rounded-xl px-4 py-3 mb-3">
            <Search size={18} className="text-gris" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por ID, barrio, fecha, cancha…"
              className="flex-1 bg-transparent text-crema text-sm outline-none placeholder:text-gris"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gris">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Cerca de mí */}
          <button
            onClick={() => setMapOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-naranja/15 border border-naranja/40 text-naranja font-display text-sm py-3 rounded-xl mb-4 active:scale-95 transition-transform"
          >
            <Navigation size={16} /> CERCA DE MÍ
          </button>

          {/* Format filters */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {FORMATOS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormato(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${formato === f.id ? 'bg-naranja text-carbon' : 'bg-superficie text-crema'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {activeCount > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {fecha !== 'todas' && (
                <button
                  onClick={() => setFecha('todas')}
                  className="flex items-center gap-1 bg-verde/10 border border-verde/40 text-verde text-xs px-3 py-1.5 rounded-full"
                >
                  {fecha} <X size={12} />
                </button>
              )}
              {cancha !== 'todas' && (
                <button
                  onClick={() => setCancha('todas')}
                  className="flex items-center gap-1 bg-verde/10 border border-verde/40 text-verde text-xs px-3 py-1.5 rounded-full"
                >
                  {nombrePorId[cancha]} <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* List */}
        <div className="px-5 space-y-4 pb-6">
          {extra && (
            <div>
              <p className="text-xs text-verde uppercase tracking-wider mb-2">Encontrado por código</p>
              <FieldCard picao={extra} onClick={() => onSelectPicao(extra)} />
            </div>
          )}
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <FieldCard key={p.id} picao={p} onClick={() => onSelectPicao(p)} />
            ))
          ) : !extra ? (
            <div className="text-center py-16">
              <p className="font-display text-lg text-crema mb-1">SIN PICAOS</p>
              <p className="text-sm text-gris">
                {abiertos.length === 0
                  ? 'Todavía no hay picaos abiertos. ¡Crea el primero!'
                  : 'Nada coincide con tu búsqueda. Prueba con otro término o filtro.'}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={onCrear}
        className="absolute bottom-24 right-5 w-14 h-14 bg-verde rounded-full flex items-center justify-center text-carbon shadow-[0_0_20px_rgba(196,240,66,0.3)] z-20"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* Filter Sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
              className="absolute inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 bg-superficie rounded-t-3xl z-50 p-6 pb-8 max-h-[82%] overflow-y-auto hide-scrollbar"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-crema">FILTROS</h2>
                <button onClick={clearAll} className="text-sm text-naranja font-medium">
                  Limpiar
                </button>
              </div>
              <p className="text-xs text-gris uppercase tracking-wider mb-2">Fecha</p>
              <div className="flex gap-2 flex-wrap mb-6">
                {fechas.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFecha(d)}
                    className={`px-4 py-2 rounded-xl text-sm border transition-all ${fecha === d ? 'bg-verde text-carbon border-verde font-semibold' : 'bg-carbon text-crema border-white/10'}`}
                  >
                    {d === 'todas' ? 'Todas' : d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gris uppercase tracking-wider mb-2">Cancha</p>
              <div className="flex flex-col gap-2 mb-6">
                {canchas.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCancha(c)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all ${cancha === c ? 'bg-verde/10 text-crema border-verde' : 'bg-carbon text-crema border-white/10'}`}
                  >
                    <span>{c === 'todas' ? 'Todas las canchas' : nombrePorId[c]}</span>
                    {cancha === c && <Check size={16} className="text-verde" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSheet(false)}
                className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform"
              >
                VER {filtered.length} PICAO{filtered.length === 1 ? '' : 'S'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Map / Cerca de mí */}
      <AnimatePresence>
        {mapOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMapOpen(false)}
              className="absolute inset-0 bg-black/70 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="absolute bottom-0 left-0 right-0 bg-carbon rounded-t-3xl z-50 p-5 pb-8 max-h-[88%] overflow-y-auto hide-scrollbar border-t border-white/10"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-crema">CERCA DE TI</h2>
                <button onClick={() => setMapOpen(false)} className="text-gris">
                  <X size={22} />
                </button>
              </div>

              {!located ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-full bg-naranja/15 border border-naranja/40 flex items-center justify-center mx-auto mb-4">
                    <Navigation size={26} className="text-naranja" />
                  </div>
                  <h3 className="font-display text-lg text-crema mb-2">ACTIVA TU UBICACIÓN</h3>
                  <p className="text-sm text-gris mb-6">
                    Para mostrarte los picaos más cercanos en tiempo real necesitamos tu ubicación.
                  </p>
                  <button
                    onClick={activarUbicacion}
                    disabled={locating}
                    className="w-full bg-verde text-carbon font-display text-lg py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-60"
                  >
                    {locating ? 'BUSCANDO…' : 'ACTIVAR UBICACIÓN'}
                  </button>
                </div>
              ) : nearby.length === 0 ? (
                <div className="text-center py-10 text-gris text-sm">
                  No hay picaos abiertos cerca por ahora.
                </div>
              ) : (
                <>
                  {/* Lista cercana */}
                  <p className="text-xs text-gris uppercase tracking-wider mb-2">
                    {nearby.length} picao{nearby.length === 1 ? '' : 's'} abierto{nearby.length === 1 ? '' : 's'}
                  </p>
                  <div className="space-y-2">
                    {nearby.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToPicao(p)}
                        className="w-full flex items-center gap-3 bg-superficie rounded-xl p-3 text-left active:scale-[0.98] transition-transform"
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-verde">
                          <MapPin size={16} className="text-carbon" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-crema font-semibold text-sm truncate">{nombreCancha(p)}</p>
                          <p className="text-xs text-gris">
                            {barrioCancha(p)} · {p.date} {p.time} · #{p.code}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
