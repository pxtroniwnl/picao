import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

// Destino del enlace mágico. Intercambia el `code` por una sesión (cookies)
// y devuelve al usuario a la app, ya autenticado.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(origin)
  }

  // Enlace inválido o vencido → vuelve al inicio.
  return NextResponse.redirect(`${origin}/?auth_error=1`)
}
