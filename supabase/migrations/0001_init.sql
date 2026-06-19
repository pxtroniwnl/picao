-- Picao — esquema inicial (paso 4 del roadmap)
-- Modelo fiel a CLAUDE.md §5 (modelo de datos) y §6 (lógica de negocio).
-- Construido para Supabase (Postgres + auth.users + RLS).

-- ============================================================
-- 1. Enums
-- ============================================================

create type zona as enum ('ARQUERO', 'DEFENSA', 'MEDIO', 'ATAQUE');
create type visibilidad as enum ('publico', 'privado');
create type estado_picao as enum ('abierto', 'confirmado', 'lleno', 'jugado', 'cancelado');
create type estado_pago as enum ('pendiente', 'pagado', 'devuelto', 'fallido');

-- ============================================================
-- 2. Funciones de negocio
-- ============================================================

-- Genera un código de picao con formato PCO-XXXX (4 dígitos).
create or replace function gen_codigo_pco()
returns text
language sql
volatile
as $$
  select 'PCO-' || lpad((floor(random() * 10000))::int::text, 4, '0');
$$;

-- Seña por jugador = precio_cancha_hora / cupos_totales + $1.250 (tarifa de organización).
-- Regla del CLAUDE.md §6, centralizada en la DB para reusar al crear picaos (paso 5).
create or replace function calcular_sena(precio numeric, cupos int)
returns numeric
language sql
immutable
as $$
  select round(precio / nullif(cupos, 0) + 1250);
$$;

-- ============================================================
-- 3. Catálogos
-- ============================================================

-- Formatos de juego con sus cupos totales (FUTBOL5=10, FUTBOL7=14, FUTBOL8=16, FUTBOL11=22).
create table formatos (
  id            text primary key,           -- 'FUTBOL5' | 'FUTBOL7' | 'FUTBOL8' | 'FUTBOL11'
  label         text not null,              -- 'Fútbol 5', etc.
  cupos_totales int  not null check (cupos_totales > 0)
);

-- Catálogo de posiciones: cada una pertenece a un formato y lleva su zona implícita (§5).
create table posiciones (
  id         uuid primary key default gen_random_uuid(),
  formato_id text not null references formatos(id) on delete cascade,
  zona       zona not null,
  nombre     text not null,
  unique (formato_id, nombre)
);

create index posiciones_formato_idx on posiciones (formato_id);

-- ============================================================
-- 4. Usuarios
-- ============================================================

-- Perfil de jugador, 1:1 con auth.users. En el registro elige zona (obligatorio) y
-- posición específica (opcional) — la zona vive en la posición, no como atributo aparte.
create table usuarios (
  id             uuid primary key references auth.users(id) on delete cascade,
  apodo          text not null,
  telefono       text,
  email          text,
  zona_preferida zona,
  posicion_id    uuid references posiciones(id) on delete set null,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- 5. Picaos
-- ============================================================

create table picaos (
  id                 uuid primary key default gen_random_uuid(),
  codigo             text not null unique default gen_codigo_pco(),
  organizador_id     uuid not null references usuarios(id) on delete cascade,
  cancha_nombre      text not null,
  barrio             text not null,
  formato_id         text not null references formatos(id),
  fecha              date not null,
  hora               time not null,
  duracion_horas     numeric(3,1) not null default 1 check (duracion_horas > 0),
  precio_cancha_hora numeric not null check (precio_cancha_hora >= 0),
  sena               numeric not null check (sena >= 0),
  visibilidad        visibilidad not null default 'privado',
  estado             estado_picao not null default 'abierto',
  created_at         timestamptz not null default now()
);

create index picaos_listado_idx on picaos (estado, visibilidad);
create index picaos_codigo_idx   on picaos (codigo);

-- ============================================================
-- 6. Inscripciones (jugadores_picao)
-- ============================================================

create table inscripciones (
  id          uuid primary key default gen_random_uuid(),
  picao_id    uuid not null references picaos(id) on delete cascade,
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  estado_pago estado_pago not null default 'pendiente',
  created_at  timestamptz not null default now(),
  unique (picao_id, usuario_id)
);

create index inscripciones_picao_idx on inscripciones (picao_id);

-- ============================================================
-- 7. Pagos (señas vía Wompi)
-- ============================================================

create table pagos (
  id                  uuid primary key default gen_random_uuid(),
  inscripcion_id      uuid not null references inscripciones(id) on delete cascade,
  monto               numeric not null check (monto >= 0),
  estado              estado_pago not null default 'pendiente',
  wompi_referencia    text,          -- referencia propia enviada a Wompi
  wompi_transaccion_id text,         -- id de transacción devuelto por Wompi (para devoluciones)
  created_at          timestamptz not null default now()
);

create index pagos_inscripcion_idx on pagos (inscripcion_id);

-- ============================================================
-- 8. Row Level Security
-- ============================================================

alter table formatos      enable row level security;
alter table posiciones    enable row level security;
alter table usuarios      enable row level security;
alter table picaos        enable row level security;
alter table inscripciones enable row level security;
alter table pagos         enable row level security;

-- Catálogos: lectura pública (anon + authenticated).
create policy "formatos_lectura_publica" on formatos
  for select using (true);
create policy "posiciones_lectura_publica" on posiciones
  for select using (true);

-- Usuarios: cada quien lee y edita solo su propio perfil.
create policy "usuarios_lectura_propia" on usuarios
  for select using (auth.uid() = id);
create policy "usuarios_insert_propio" on usuarios
  for insert with check (auth.uid() = id);
create policy "usuarios_update_propio" on usuarios
  for update using (auth.uid() = id);

-- Picaos: los públicos los lee cualquiera; los privados solo el organizador
-- (el acceso por código PCO se afina en el paso 5). Escritura solo el organizador.
create policy "picaos_lectura_publicos" on picaos
  for select using (visibilidad = 'publico' or auth.uid() = organizador_id);
create policy "picaos_insert_organizador" on picaos
  for insert with check (auth.uid() = organizador_id);
create policy "picaos_update_organizador" on picaos
  for update using (auth.uid() = organizador_id);

-- Inscripciones: el jugador ve/gestiona las suyas.
create policy "inscripciones_lectura_propia" on inscripciones
  for select using (auth.uid() = usuario_id);
create policy "inscripciones_insert_propia" on inscripciones
  for insert with check (auth.uid() = usuario_id);
create policy "inscripciones_update_propia" on inscripciones
  for update using (auth.uid() = usuario_id);

-- Pagos: el dueño de la inscripción asociada.
create policy "pagos_lectura_propia" on pagos
  for select using (
    exists (
      select 1 from inscripciones i
      where i.id = pagos.inscripcion_id and i.usuario_id = auth.uid()
    )
  );
create policy "pagos_insert_propia" on pagos
  for insert with check (
    exists (
      select 1 from inscripciones i
      where i.id = pagos.inscripcion_id and i.usuario_id = auth.uid()
    )
  );
