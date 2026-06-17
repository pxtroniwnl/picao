# CLAUDE.md — Picao

> Este archivo es el contexto maestro del proyecto. Claude Code lo lee al inicio de cada sesión.
> Mantenlo actualizado: cuando tomes una decisión importante, anótala aquí.

---

## 1. Qué es Picao

App móvil hiperlocal para **organizar y llenar partidos de fútbol amateur** ("picaos") en Cartagena, Colombia.

**Diferenciador central (no negociable):** el problema que resolvemos es **"llenar el partido"** — el *matchmaking* y armado del grupo de jugadores. NO somos una app de reserva de canchas (ese mercado está copado por easycancha en Colombia y es de bajo margen). La capa social/de emparejamiento es lo defensible.

**Cuña geográfica:** la costa Caribe, donde los competidores grandes son débiles.

**Equipo:** 3 co-fundadores. Operamos como side project hasta validar el margen.

---

## 2. Stack técnico

- **Frontend:** Next.js (como **PWA** — instalable en el celular, sin tienda de apps al inicio).
- **Backend / datos:** **Supabase** → auth por OTP (SMS), base de datos Postgres, realtime.
- **Pagos:** **Wompi** → Nequi, Daviplata, PSE.
- **Idioma del producto:** español (Colombia). Copys con tono costeño, cercano, sin tecnicismos.

---

## 3. Modelo de negocio (para construir las features correctas)

Tres capas:

- **Capa 1 — Señas:** depósito pequeño por jugador para confirmar el cupo (vía Wompi). Sirve doble: confirma asistencia y elimina el problema de los "no-show". Por sí sola NO sostiene salarios.
- **Capa 2 — Torneos y patrocinios de barrio:** el motor de margen real. Hay que validarla antes de dedicación completa.
- **Capa 3 — Suscripción premium de jugador** (ELO, estadísticas): fase futura.

**Riesgo estructural a tener en cuenta al diseñar pagos:** las comisiones fijas sobre transacciones pequeñas duelen. Por eso **se agrupa en una sola transacción por jugador** la parte de la cancha + la tarifa de servicio, para reducir el impacto de la comisión fija.

---

## 4. Sistema de diseño

**Tokens de color:**

| Token | Hex | Rol |
|---|---|---|
| Naranja Brasa | `#FF5436` | Primario (≈30%) |
| Carbón Cancha | `#16171D` | Base oscura (≈60%) |
| Verde Eléctrico | `#C4F042` | CTAs — **siempre con texto carbón** (≈10%) |
| Magenta Bugambilia | `#E5167B` | Estados urgentes |
| Crema | `#FAF5EC` | Texto de cuerpo |

**Regla de proporción:** 60% carbón / 30% naranja / 10% verde.

**Tipografía:**
- **Archivo Black / Archivo Expanded** → display, titulares, todo en MAYÚSCULAS.
- **Inter** → cuerpo y UI.

**Logo (O-cancha):** la letra **O** rediseñada como una cancha vista desde arriba: círculo con borde naranja, línea horizontal verde (mediocampo), punto central verde. Funciona como elemento del wordmark **PICAO.** y como ícono de la app por separado.

> ⚠️ Nota: en el Figma actual el logo quedó mal escrito como "PICOA" por un orden incorrecto de auto-layout. Lo correcto es **PICAO**. Corregir al pasar a código.

---

## 5. Modelo de datos

### Formatos y posiciones
Cuatro formatos: **FUTBOL5, FUTBOL7, FUTBOL8, FUTBOL11**.

Tabla `posiciones`: cada posición lleva **`formato_id`** y **`zona`**. Las zonas (`ARQUERO`, `DEFENSA`, `MEDIO`, `ATAQUE`) son una propiedad implícita de la posición, NO un atributo aparte del usuario.

En el registro: el jugador elige **zona (obligatorio)** + **posición específica (opcional)**. Esto acomoda al casual y al competitivo sin cambiar el esquema.

### Entidades principales (a modelar en Supabase)
- `usuarios` — perfil, apodo, zona preferida, posición opcional.
- `picaos` — partido: cancha, barrio, fecha, hora, formato, precio cancha/hora, visibilidad, organizador, estado.
- `inscripciones` / `jugadores_picao` — quién está dentro de cada picao y estado de pago.
- `pagos` — señas vía Wompi, con estado y referencia para devoluciones.
- `posiciones` — catálogo (formato_id + zona), precargado.

---

## 6. Lógica de negocio clave

- **Cupos por formato:** FUTBOL5 = 10, FUTBOL7 = 14, FUTBOL8 = 16, FUTBOL11 = 22 (jugadores por lado × 2).
- **Seña por jugador** = `precio_cancha_por_hora / cupos_totales` + **$1.250** (tarifa de organización), en una sola transacción.
- **Confirmación:** cuando se llenan los cupos, el picao pasa a `confirmado` automáticamente.
- **Devolución:** si el picao NO se llena, las señas se devuelven.
- **Visibilidad:** `privado` (solo accesible por código, por defecto) o `público` (aparece en la lista). El código tiene formato **`PCO-XXXX`**.
- **Rescate:** modo para llenar cupos faltantes; puede ser privado (link) o público.

---

## 7. Pantallas del MVP

Referencia: prototipo navegable de 13+ pantallas. Navegación con **bottom nav de 3 tabs: Picaos · Mis Picaos · Perfil**.

Pantallas: Splash · Onboarding · Welcome · Login · Register (flujo de 3 pasos) · Home/Picaos · Detalle · Pago · Confirmado · Mis Picaos · Chat · Perfil · Notificaciones · Crear Picao.

**Núcleo a construir primero (el loop que vale):**
Crear Picao → genera código PCO → otros lo ven/buscan → Detalle → Unirse y pagar seña (Pago) → al llenarse → Confirmado.

Chat, Notificaciones y Onboarding van después del loop central.

---

## 8. Decisiones y convenciones

- El booking puro de canchas está descartado como propuesta de valor; la capa social es el foco.
- Wireframes y assets de marca son workstreams separados.
- Construir por capas, una pantalla / un sistema a la vez — no generar todo de golpe.
- Antes del build completo se recomienda un **MVP concierge** (Google Form + WhatsApp + link de pago manual) para validar que la gente paga la seña. (Decisión del fundador: avanzar al build.)

---

## 9. Recursos externos

- **Prototipo en vivo (Magic Patterns):** https://project-quick-lagoon-586.magicpatterns.app
  - Editor ID: `2vlqw28kjvbpkfs74uqhwm`
- **Figma (key):** `bnFNF00fYO9GZG3IaBwu3u` — conectar vía MCP para leer las pantallas reales. (Recordar: corregir "PICOA" → "PICAO".)
- **Documento de definición del MVP** (.docx, 13 secciones) y **brand book** — colocar copias en este repo (`/docs`) para que Claude Code los lea.

---

## 10. Orden de construcción sugerido

1. Scaffold del proyecto **Next.js (PWA)** + estructura de carpetas + tokens de diseño en CSS/Tailwind.
2. Layout base + bottom nav (3 tabs) + tema (colores, fuentes).
3. **Auth** con Supabase (OTP por SMS) → Welcome / Register / Login.
4. Modelo de datos en Supabase (tablas + `posiciones` precargadas).
5. **Loop central:** Crear Picao → Detalle → Home/Picaos.
6. **Pagos** con Wompi (seña agrupada) → Pago → Confirmado → lógica de devolución.
7. Mis Picaos + Perfil.
8. Realtime (cupos en vivo), luego Chat y Notificaciones.
9. Deploy.

---

> Convención para Claude Code: trabaja una capa a la vez, muestra el plan antes de cambios grandes, y respeta los tokens de diseño y el modelo de datos de este archivo al pie de la letra.