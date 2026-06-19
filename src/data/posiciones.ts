import type { Zona } from '../lib/supabase/types'

// Catálogo del selector de cancha. Única fuente del layout en el front.
// `codigo` calza 1:1 con la columna posiciones.codigo en Supabase
// (ver supabase/migrations/0003_perfil_extendido.sql): el front pinta por
// coordenadas y persiste por posicion_id resuelto desde el codigo.

export type FormatoId = 'FUTBOL5' | 'FUTBOL7' | 'FUTBOL8' | 'FUTBOL11'

export interface PosicionCatalogo {
  codigo: string
  formato: FormatoId
  zona: Zona
  label: string
  abbr: string
  x: number // % horizontal dentro del campo
  y: number // % vertical
}

export const FORMATOS: { id: FormatoId; label: string }[] = [
  { id: 'FUTBOL5', label: 'Fútbol 5' },
  { id: 'FUTBOL7', label: 'Fútbol 7' },
  { id: 'FUTBOL8', label: 'Fútbol 8' },
  { id: 'FUTBOL11', label: 'Fútbol 11' },
]

export const ZONAS: { id: Zona; label: string; emoji: string; desc: string }[] = [
  { id: 'ARQUERO', label: 'Arquero', emoji: '🧤', desc: 'Bajo los tres palos' },
  { id: 'DEFENSA', label: 'Defensa', emoji: '🛡️', desc: 'Atrás, cortando' },
  { id: 'MEDIO', label: 'Medio', emoji: '⚙️', desc: 'El motor del equipo' },
  { id: 'ATAQUE', label: 'Ataque', emoji: '🎯', desc: 'Arriba, al gol' },
]

export const ZONA_LABEL: Record<Zona, string> = {
  ARQUERO: 'Arquero',
  DEFENSA: 'Defensa',
  MEDIO: 'Medio',
  ATAQUE: 'Ataque',
}

export const POSICIONES: PosicionCatalogo[] = [
  // FUTBOL5
  { codigo: 'F5_POR', formato: 'FUTBOL5', zona: 'ARQUERO', label: 'Portero', abbr: 'POR', x: 50, y: 88 },
  { codigo: 'F5_CIE', formato: 'FUTBOL5', zona: 'DEFENSA', label: 'Cierre', abbr: 'CIE', x: 50, y: 68 },
  { codigo: 'F5_ALI', formato: 'FUTBOL5', zona: 'MEDIO', label: 'Ala Izq.', abbr: 'ALI', x: 22, y: 46 },
  { codigo: 'F5_ALD', formato: 'FUTBOL5', zona: 'MEDIO', label: 'Ala Der.', abbr: 'ALD', x: 78, y: 46 },
  { codigo: 'F5_PIV', formato: 'FUTBOL5', zona: 'ATAQUE', label: 'Pívot', abbr: 'PIV', x: 50, y: 22 },

  // FUTBOL7
  { codigo: 'F7_POR', formato: 'FUTBOL7', zona: 'ARQUERO', label: 'Portero', abbr: 'POR', x: 50, y: 90 },
  { codigo: 'F7_LI', formato: 'FUTBOL7', zona: 'DEFENSA', label: 'Lateral Izq.', abbr: 'LI', x: 18, y: 72 },
  { codigo: 'F7_DFC', formato: 'FUTBOL7', zona: 'DEFENSA', label: 'Defensa', abbr: 'DFC', x: 50, y: 75 },
  { codigo: 'F7_LD', formato: 'FUTBOL7', zona: 'DEFENSA', label: 'Lateral Der.', abbr: 'LD', x: 82, y: 72 },
  { codigo: 'F7_MC', formato: 'FUTBOL7', zona: 'MEDIO', label: 'Medio Centro', abbr: 'MC', x: 50, y: 50 },
  { codigo: 'F7_EI', formato: 'FUTBOL7', zona: 'ATAQUE', label: 'Extremo Izq.', abbr: 'EI', x: 22, y: 30 },
  { codigo: 'F7_ED', formato: 'FUTBOL7', zona: 'ATAQUE', label: 'Extremo Der.', abbr: 'ED', x: 78, y: 30 },
  { codigo: 'F7_DEL', formato: 'FUTBOL7', zona: 'ATAQUE', label: 'Delantero', abbr: 'DEL', x: 50, y: 14 },

  // FUTBOL8
  { codigo: 'F8_POR', formato: 'FUTBOL8', zona: 'ARQUERO', label: 'Portero', abbr: 'POR', x: 50, y: 90 },
  { codigo: 'F8_LI', formato: 'FUTBOL8', zona: 'DEFENSA', label: 'Lateral Izq.', abbr: 'LI', x: 20, y: 74 },
  { codigo: 'F8_DFC', formato: 'FUTBOL8', zona: 'DEFENSA', label: 'Defensa Central', abbr: 'DFC', x: 50, y: 77 },
  { codigo: 'F8_LD', formato: 'FUTBOL8', zona: 'DEFENSA', label: 'Lateral Der.', abbr: 'LD', x: 80, y: 74 },
  { codigo: 'F8_MCD', formato: 'FUTBOL8', zona: 'MEDIO', label: 'Volante', abbr: 'VOL', x: 50, y: 54 },
  { codigo: 'F8_MI', formato: 'FUTBOL8', zona: 'MEDIO', label: 'Medio Izq.', abbr: 'MI', x: 25, y: 42 },
  { codigo: 'F8_MD', formato: 'FUTBOL8', zona: 'MEDIO', label: 'Medio Der.', abbr: 'MD', x: 75, y: 42 },
  { codigo: 'F8_DC', formato: 'FUTBOL8', zona: 'ATAQUE', label: 'Delantero', abbr: 'DC', x: 50, y: 18 },

  // FUTBOL11
  { codigo: 'F11_POR', formato: 'FUTBOL11', zona: 'ARQUERO', label: 'Portero', abbr: 'POR', x: 50, y: 92 },
  { codigo: 'F11_LI', formato: 'FUTBOL11', zona: 'DEFENSA', label: 'Lateral Izq.', abbr: 'LI', x: 14, y: 77 },
  { codigo: 'F11_CTI', formato: 'FUTBOL11', zona: 'DEFENSA', label: 'Central Izq.', abbr: 'DFC', x: 37, y: 81 },
  { codigo: 'F11_CTD', formato: 'FUTBOL11', zona: 'DEFENSA', label: 'Central Der.', abbr: 'DFC', x: 63, y: 81 },
  { codigo: 'F11_LD', formato: 'FUTBOL11', zona: 'DEFENSA', label: 'Lateral Der.', abbr: 'LD', x: 86, y: 77 },
  { codigo: 'F11_MCD', formato: 'FUTBOL11', zona: 'MEDIO', label: 'Mediocentro Def.', abbr: 'MCD', x: 50, y: 64 },
  { codigo: 'F11_MI', formato: 'FUTBOL11', zona: 'MEDIO', label: 'Mediocentro Izq.', abbr: 'MC', x: 28, y: 51 },
  { codigo: 'F11_MD', formato: 'FUTBOL11', zona: 'MEDIO', label: 'Mediocentro Der.', abbr: 'MC', x: 72, y: 51 },
  { codigo: 'F11_MP', formato: 'FUTBOL11', zona: 'MEDIO', label: 'Mediapunta', abbr: 'MP', x: 50, y: 38 },
  { codigo: 'F11_EI', formato: 'FUTBOL11', zona: 'ATAQUE', label: 'Extremo Izq.', abbr: 'EI', x: 16, y: 27 },
  { codigo: 'F11_ED', formato: 'FUTBOL11', zona: 'ATAQUE', label: 'Extremo Der.', abbr: 'ED', x: 84, y: 27 },
  { codigo: 'F11_DC', formato: 'FUTBOL11', zona: 'ATAQUE', label: 'Delantero', abbr: 'DC', x: 50, y: 13 },
]

export const posicionesPorFormato = (f: FormatoId): PosicionCatalogo[] =>
  POSICIONES.filter((p) => p.formato === f)
