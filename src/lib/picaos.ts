import { createClient } from './supabase/client'
import type { Database, Visibilidad } from './supabase/types'
import type { Picao } from '../data/picaos'

export type Cancha = Database['public']['Tables']['canchas']['Row']
type PicaoRow = Database['public']['Tables']['picaos']['Row']

const FORMATO_UI: Record<string, string> = {
  FUTBOL5: '5v5',
  FUTBOL7: '7v7',
  FUTBOL8: '8v8',
  FUTBOL11: '11v11',
}
const CUPOS: Record<string, number> = {
  FUTBOL5: 10,
  FUTBOL7: 14,
  FUTBOL8: 16,
  FUTBOL11: 22,
}

// --- helpers de hora/fecha ---

// '8:00 PM' -> '20:00' (para guardar en la columna time)
function to24h(h12: string): string {
  const m = h12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!m) return '00:00'
  let h = parseInt(m[1], 10)
  const ap = m[3]?.toUpperCase()
  if (ap === 'PM' && h < 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

// '20:00:00' -> '8:00 PM'
function to12h(t: string): string {
  const [hh, mm] = t.split(':')
  let h = parseInt(hh, 10)
  const ap = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${mm} ${ap}`
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
function formatFecha(f: string): string {
  const [y, m, d] = f.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)
  if (fecha.getTime() === hoy.getTime()) return 'Hoy'
  if (fecha.getTime() === manana.getTime()) return 'Mañana'
  return `${d} ${MESES[m - 1]}`
}

const ESTADO_UI: Record<string, NonNullable<Picao['status']>> = {
  abierto: 'abierto',
  confirmado: 'confirmado',
  lleno: 'lleno',
  jugado: 'jugado',
  cancelado: 'jugado',
}

// Adaptador: fila real de picaos -> forma Picao que consume la UI.
function aPicaoUI(row: PicaoRow, fotoUrl?: string | null): Picao {
  const cupos = CUPOS[row.formato_id] ?? 10
  return {
    id: row.id,
    code: row.codigo,
    fieldId: row.cancha_id ?? '',
    date: formatFecha(row.fecha),
    time: to12h(row.hora),
    duration: `${row.duracion_horas} h`,
    hoursCount: Number(row.duracion_horas),
    format: FORMATO_UI[row.formato_id] ?? '5v5',
    slots: row.cupos_ocupados,
    totalSlots: cupos,
    price: Number(row.sena),
    urgent: false,
    map: { x: 50, y: 50 },
    distanceKm: 0,
    organizer: {
      name: row.organizador_apodo ?? 'Organizador',
      rating: 5.0,
      avatar: 'https://i.pravatar.cc/100?img=12',
    },
    players: [],
    status: ESTADO_UI[row.estado] ?? 'abierto',
    visibility: row.visibilidad,
    fotoUrl: fotoUrl ?? undefined,
    canchaNombre: row.cancha_nombre,
    barrio: row.barrio,
  }
}

// --- catálogo de canchas ---

export async function listarCanchas(): Promise<Cancha[]> {
  const supabase = createClient()
  const { data } = await supabase.from('canchas').select('*').eq('activa', true).order('nombre')
  return data ?? []
}

// --- crear ---

export async function crearPicao(input: {
  canchaId: string
  fecha: string
  horas: string[]
  visibilidad: Visibilidad
}): Promise<{ picao: Picao | null; error: string | null }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { picao: null, error: 'No hay sesión activa.' }

  const { data: cancha } = await supabase
    .from('canchas')
    .select('*')
    .eq('id', input.canchaId)
    .single()
  if (!cancha) return { picao: null, error: 'Cancha no encontrada.' }

  const cupos = CUPOS[cancha.formato_id] ?? 10
  const sena = Math.round(cancha.precio_hora / cupos) + 1250

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('apodo')
    .eq('id', user.id)
    .single()

  const { data: row, error } = await supabase
    .from('picaos')
    .insert({
      organizador_id: user.id,
      organizador_apodo: perfil?.apodo ?? null,
      cancha_id: cancha.id,
      cancha_nombre: cancha.nombre,
      barrio: cancha.barrio,
      formato_id: cancha.formato_id,
      fecha: input.fecha,
      hora: to24h(input.horas[0]),
      duracion_horas: input.horas.length,
      precio_cancha_hora: cancha.precio_hora,
      sena,
      visibilidad: input.visibilidad,
      estado: 'abierto',
    })
    .select()
    .single()

  if (error || !row) return { picao: null, error: error?.message ?? 'No se pudo crear el picao.' }
  return { picao: aPicaoUI(row, cancha.foto_url), error: null }
}

// --- listar / buscar ---

export async function listarPicaosPublicos(): Promise<Picao[]> {
  const supabase = createClient()
  const { data: rows } = await supabase
    .from('picaos')
    .select('*')
    .eq('visibilidad', 'publico')
    .eq('estado', 'abierto')
    .order('created_at', { ascending: false })
  if (!rows?.length) return []

  // Resolver fotos por cancha_id (una sola consulta).
  const ids = [...new Set(rows.map((r) => r.cancha_id).filter((x): x is string => Boolean(x)))]
  const fotos: Record<string, string | null> = {}
  if (ids.length) {
    const { data: canchas } = await supabase.from('canchas').select('id, foto_url').in('id', ids)
    for (const c of canchas ?? []) fotos[c.id] = c.foto_url
  }

  return rows.map((r) => aPicaoUI(r, r.cancha_id ? fotos[r.cancha_id] : null))
}

// Busca por código PCO (incluye privados, vía función SECURITY DEFINER).
export async function buscarPorCodigo(codigo: string): Promise<Picao | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('buscar_picao_por_codigo', { p_codigo: codigo })
  if (error || !data?.length) return null
  const row = data[0]
  let foto: string | null = null
  if (row.cancha_id) {
    const { data: c } = await supabase
      .from('canchas')
      .select('foto_url')
      .eq('id', row.cancha_id)
      .single()
    foto = c?.foto_url ?? null
  }
  return aPicaoUI(row, foto)
}
