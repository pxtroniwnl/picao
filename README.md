# PICAO ⚽

App móvil **hiperlocal** para **organizar y llenar partidos de fútbol amateur** ("picaos")
en Cartagena, Colombia.

> El problema que resolvemos NO es reservar canchas (mercado copado y de bajo margen):
> es **llenar el partido** — el *matchmaking* y armado del grupo de jugadores. Esa capa
> social es lo defensible. La cuña geográfica es la costa Caribe.

Construida como **PWA** (instalable desde el celular, sin tienda de apps al inicio).

---

## 📸 Capturas

| Splash | Onboarding | Welcome | Login |
|:---:|:---:|:---:|:---:|
| ![Splash](docs/screenshots/01-splash.png) | ![Onboarding](docs/screenshots/02-onboarding.png) | ![Welcome](docs/screenshots/03-welcome.png) | ![Login](docs/screenshots/04-login.png) |

| Home / Picaos | Detalle | Crear Picao | Perfil |
|:---:|:---:|:---:|:---:|
| ![Home](docs/screenshots/05-home.png) | ![Detalle](docs/screenshots/10-detalle.png) | ![Crear Picao](docs/screenshots/09-crear-picao.png) | ![Perfil](docs/screenshots/07-perfil.png) |

| Mis Picaos | Notificaciones |
|:---:|:---:|
| ![Mis Picaos](docs/screenshots/06-mis-picaos.png) | ![Notificaciones](docs/screenshots/08-notificaciones.png) |

---

## ✅ Lo que hay hecho hasta ahora

Basado en el orden de construcción del [CLAUDE.md](CLAUDE.md):

#### 🔧 Scaffold + frontend visual
- **Next.js 15 + React 18**, App Router, TypeScript, carpeta `src/`.
- **Sistema de diseño en Tailwind v3** con tokens de marca (Naranja Brasa `#FF5436`,
  Carbón Cancha `#16171D`, Verde Eléctrico `#C4F042`, Magenta Bugambilia `#E5167B`,
  Crema `#FAF5EC`).
- **Tipografías:** Archivo (display) e Inter (cuerpo) vía `next/font`.
- **Shell móvil full-screen** + **bottom nav de 3 tabs** (Picaos · Mis picaos · Perfil).
- **14 pantallas** con navegación por **máquina de estados** (`history` + `framer-motion`).
- **Capa PWA:** manifest, ícono O-cancha (SVG) y service worker instalable.

#### 🔐 Auth con Supabase (paso 3)
- **Enlace mágico (OTP por email)** con `@supabase/ssr`.
- Flujo completo: Welcome → Login → Register (3 pasos con cédula, apodo, zonas y
  posiciones favoritas).
- `middleware.ts` que refresca la sesión por cookie en cada request.
- Funciones `enviarEnlace()`, `obtenerPerfil()`, `guardarPerfil()`, `cerrarSesion()`.

#### 🗄️ Modelo de datos en Supabase (paso 4)
- **5 migraciones SQL** en `supabase/migrations/`:
  `0001_init` (usuarios, picaos, inscripciones, pagos),
  `0002_seed_catalogos` (formatos y posiciones precargadas),
  `0003_perfil_extendido` (usuario_zonas, usuario_posiciones),
  `0004_cedula_y_limpieza`, `0005_canchas`.
- Tipos autogenerados en `src/lib/supabase/types.ts`.
- Catálogo de posiciones por formato y zona.

#### 🔄 Loop central con datos reales (paso 5)
- **Crear Picao** desde canchas reales en Supabase → genera código `PCO-XXXX`.
- **Listado público** de picaos abiertos con datos desde la BD.
- **Búsqueda por código** vía función `buscar_picao_por_codigo` (SECURITY DEFINER).
- **Detalle** con información real del picao y la cancha.
- Cálculo de seña: `precio_cancha_hora / cupos_totales + $1.250`.
- **Migración de navegación:** las pantallas del loop central ya usan rutas reales de
  App Router. Las pantallas restantes (Splash, Onboarding, Welcome, etc.) siguen en
  máquina de estados mientras se migran.

> ⚠️ **Pagos con Wompi** (seña agrupada, confirmación y devolución) — pendiente (paso 6).

---

## 🧱 Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router) · React 18 · TypeScript · PWA |
| Estilos | Tailwind CSS v3 · `next/font` (Archivo + Inter) |
| Animación | framer-motion |
| Íconos | lucide-react |
| Backend | Supabase — auth OTP (email), Postgres, migraciones SQL |
| Pagos *(pendiente)* | Wompi — Nequi, Daviplata, PSE |

---

## 🚀 Cómo correrlo

Requisitos: Node 18+ y npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

Otros comandos:

```bash
npm run build        # build de producción
npm start            # sirve el build de producción
npm run lint         # ESLint
```

Para probarla como móvil: abre `http://localhost:3000` y activa la vista responsive
del navegador (DevTools). El flujo central es:
**Crear Picao → Detalle → Unirse y pagar (Pago) → Confirmado**.

---

## 📁 Estructura

```
src/
├── app/
│   ├── auth/callback/     # callback de autenticación Supabase
│   ├── layout.tsx         # fuentes, metadata, theme-color, registro del SW
│   ├── page.tsx           # máquina de estados de navegación (client)
│   ├── manifest.ts        # manifest PWA
│   └── globals.css        # Tailwind + utilidades
├── components/
│   ├── Shared.tsx          # logo O-cancha, FieldCard, AvatarStack, BottomNav
│   └── ServiceWorkerRegister.tsx
├── data/                  # tipos + helpers locales
├── lib/
│   ├── auth.ts            # auth Supabase (enlace mágico, perfil)
│   ├── picaos.ts          # CRUD real de picaos contra Supabase
│   └── supabase/          # client, server, types autogenerados
├── middleware.ts           # refresco de sesión Supabase
└── screens/                # las 14 pantallas
supabase/
├── migrations/             # 5 migraciones SQL
└── config.toml             # configuración local Supabase
public/                     # assets estáticos + service worker
docs/screenshots/           # capturas usadas en este README
```

---

## 🔭 Trabajo futuro

Siguiente en orden de construcción:

1. **Pagos con Wompi** — seña agrupada en una sola transacción
   (`precio_cancha / cupos + $1.250` de organización), confirmación automática al
   llenarse y **devolución** si no se llena.
2. **Realtime** — cupos en vivo, luego **Chat** y **Notificaciones** funcionales.
3. **Deploy.**

Modelo de negocio (para priorizar features):
- **Capa 1 — Señas:** depósito por jugador que confirma asistencia y elimina los *no-show*.
- **Capa 2 — Torneos y patrocinios de barrio:** el motor de margen real (a validar).
- **Capa 3 — Suscripción premium** (ELO, estadísticas): fase futura.

---

*Side project de 3 co-fundadores. Producto en español (Colombia), tono costeño y cercano.*
