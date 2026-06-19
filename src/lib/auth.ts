import { createClient } from './supabase/client'
import type { Zona } from './supabase/types'

// Datos de perfil que maneja la UI (Register / Perfil).
export interface PerfilDatos {
  cedula?: string | null
  apodo: string
  telefono?: string | null
  email?: string | null
  fecha_nacimiento?: string | null
  zonas: Zona[]
  posiciones: string[] // códigos del catálogo (posiciones.codigo)
}

// --- Enlace mágico ---

// Envía un enlace mágico al correo. Al hacer clic, el navegador pasa por
// /auth/callback, que crea la sesión y devuelve a la app.
// `nuevo` controla si se permite crear el usuario (registro vs inicio de sesión).
export async function enviarEnlace(email: string, opts: { nuevo: boolean }) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: opts.nuevo,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { error: error?.message ?? null }
}

// --- Perfil ---

// Lee el perfil del usuario en sesión, con sus zonas y códigos de posición.
// Devuelve null si no existe (sesión sin perfil = registro a medias).
export async function obtenerPerfil(): Promise<PerfilDatos | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('cedula, apodo, telefono, email, fecha_nacimiento')
    .eq('id', user.id)
    .maybeSingle()
  if (!usuario) return null

  const { data: zonas } = await supabase
    .from('usuario_zonas')
    .select('zona')
    .eq('usuario_id', user.id)

  const { data: refs } = await supabase
    .from('usuario_posiciones')
    .select('posicion_id')
    .eq('usuario_id', user.id)

  let posiciones: string[] = []
  const ids = (refs ?? []).map((r) => r.posicion_id)
  if (ids.length) {
    const { data: cats } = await supabase
      .from('posiciones')
      .select('codigo')
      .in('id', ids)
    posiciones = (cats ?? []).map((c) => c.codigo)
  }

  return {
    ...usuario,
    zonas: (zonas ?? []).map((z) => z.zona),
    posiciones,
  }
}

// Crea/actualiza el perfil del usuario en sesión y reemplaza sus zonas/posiciones.
export async function guardarPerfil(datos: PerfilDatos) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No hay sesión activa.' }

  const { error: errUsuario } = await supabase.from('usuarios').upsert({
    id: user.id,
    cedula: datos.cedula ?? null,
    apodo: datos.apodo,
    telefono: datos.telefono ?? null,
    email: datos.email ?? user.email ?? null,
    fecha_nacimiento: datos.fecha_nacimiento ?? null,
  })
  if (errUsuario) return { error: errUsuario.message }

  // Reemplazo simple de zonas (borrar e insertar).
  await supabase.from('usuario_zonas').delete().eq('usuario_id', user.id)
  if (datos.zonas.length) {
    const { error } = await supabase
      .from('usuario_zonas')
      .insert(datos.zonas.map((zona) => ({ usuario_id: user.id, zona })))
    if (error) return { error: error.message }
  }

  // Resuelve códigos → posicion_id y reemplaza.
  await supabase.from('usuario_posiciones').delete().eq('usuario_id', user.id)
  if (datos.posiciones.length) {
    const { data: refs } = await supabase
      .from('posiciones')
      .select('id, codigo')
      .in('codigo', datos.posiciones)
    if (refs?.length) {
      const { error } = await supabase
        .from('usuario_posiciones')
        .insert(refs.map((r) => ({ usuario_id: user.id, posicion_id: r.id })))
      if (error) return { error: error.message }
    }
  }

  return { error: null }
}

export async function cerrarSesion() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
