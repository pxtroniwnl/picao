// Tipos del modelo de datos de Picao, escritos a mano para tipar el SDK de Supabase.
// Reflejan supabase/migrations/0001_init.sql + 0003_perfil_extendido.sql.
// Regenerar con: supabase gen types typescript --project-id iatarltylsjnjorjjvfl > src/lib/supabase/types.ts

export type Zona = 'ARQUERO' | 'DEFENSA' | 'MEDIO' | 'ATAQUE'
export type Visibilidad = 'publico' | 'privado'
export type EstadoPicao = 'abierto' | 'confirmado' | 'lleno' | 'jugado' | 'cancelado'
export type EstadoPago = 'pendiente' | 'pagado' | 'devuelto' | 'fallido'

export type Database = {
  public: {
    Tables: {
      formatos: {
        Row: { id: string; label: string; cupos_totales: number }
        Insert: { id: string; label: string; cupos_totales: number }
        Update: { id?: string; label?: string; cupos_totales?: number }
        Relationships: []
      }
      canchas: {
        Row: {
          id: string
          nombre: string
          barrio: string
          foto_url: string | null
          formato_id: string
          precio_hora: number
          horas: string[]
          activa: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          barrio: string
          foto_url?: string | null
          formato_id: string
          precio_hora: number
          horas?: string[]
          activa?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          barrio?: string
          foto_url?: string | null
          formato_id?: string
          precio_hora?: number
          horas?: string[]
          activa?: boolean
          created_at?: string
        }
        Relationships: []
      }
      posiciones: {
        Row: { id: string; formato_id: string; zona: Zona; nombre: string; codigo: string }
        Insert: { id?: string; formato_id: string; zona: Zona; nombre: string; codigo: string }
        Update: { id?: string; formato_id?: string; zona?: Zona; nombre?: string; codigo?: string }
        Relationships: []
      }
      usuarios: {
        Row: {
          id: string
          cedula: string | null
          apodo: string
          telefono: string | null
          email: string | null
          fecha_nacimiento: string | null
          es_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          cedula?: string | null
          apodo: string
          telefono?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          es_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          cedula?: string | null
          apodo?: string
          telefono?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          es_admin?: boolean
          created_at?: string
        }
        Relationships: []
      }
      usuario_zonas: {
        Row: { usuario_id: string; zona: Zona }
        Insert: { usuario_id: string; zona: Zona }
        Update: { usuario_id?: string; zona?: Zona }
        Relationships: []
      }
      usuario_posiciones: {
        Row: { usuario_id: string; posicion_id: string }
        Insert: { usuario_id: string; posicion_id: string }
        Update: { usuario_id?: string; posicion_id?: string }
        Relationships: []
      }
      picaos: {
        Row: {
          id: string
          codigo: string
          organizador_id: string
          organizador_apodo: string | null
          cancha_id: string | null
          cancha_nombre: string
          barrio: string
          formato_id: string
          fecha: string
          hora: string
          duracion_horas: number
          precio_cancha_hora: number
          sena: number
          cupos_ocupados: number
          visibilidad: Visibilidad
          estado: EstadoPicao
          created_at: string
        }
        Insert: {
          id?: string
          codigo?: string
          organizador_id: string
          organizador_apodo?: string | null
          cancha_id?: string | null
          cancha_nombre: string
          barrio: string
          formato_id: string
          fecha: string
          hora: string
          duracion_horas?: number
          precio_cancha_hora: number
          sena: number
          cupos_ocupados?: number
          visibilidad?: Visibilidad
          estado?: EstadoPicao
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          organizador_id?: string
          organizador_apodo?: string | null
          cancha_id?: string | null
          cancha_nombre?: string
          barrio?: string
          formato_id?: string
          fecha?: string
          hora?: string
          duracion_horas?: number
          precio_cancha_hora?: number
          sena?: number
          cupos_ocupados?: number
          visibilidad?: Visibilidad
          estado?: EstadoPicao
          created_at?: string
        }
        Relationships: []
      }
      inscripciones: {
        Row: {
          id: string
          picao_id: string
          usuario_id: string
          estado_pago: EstadoPago
          created_at: string
        }
        Insert: {
          id?: string
          picao_id: string
          usuario_id: string
          estado_pago?: EstadoPago
          created_at?: string
        }
        Update: {
          id?: string
          picao_id?: string
          usuario_id?: string
          estado_pago?: EstadoPago
          created_at?: string
        }
        Relationships: []
      }
      pagos: {
        Row: {
          id: string
          inscripcion_id: string
          monto: number
          estado: EstadoPago
          wompi_referencia: string | null
          wompi_transaccion_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inscripcion_id: string
          monto: number
          estado?: EstadoPago
          wompi_referencia?: string | null
          wompi_transaccion_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inscripcion_id?: string
          monto?: number
          estado?: EstadoPago
          wompi_referencia?: string | null
          wompi_transaccion_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      gen_codigo_pco: { Args: Record<never, never>; Returns: string }
      calcular_sena: { Args: { precio: number; cupos: number }; Returns: number }
      buscar_picao_por_codigo: {
        Args: { p_codigo: string }
        Returns: Database['public']['Tables']['picaos']['Row'][]
      }
    }
    Enums: {
      zona: Zona
      visibilidad: Visibilidad
      estado_picao: EstadoPicao
      estado_pago: EstadoPago
    }
    CompositeTypes: Record<never, never>
  }
}
