-- Picao — catálogo de canchas (paso 5) + bandera de admin para gestión futura.

-- ============================================================
-- 1. Tabla canchas (cada cancha fija formato + precio + horas)
-- ============================================================

create table canchas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  barrio      text not null,
  foto_url    text,
  formato_id  text not null references formatos(id),
  precio_hora numeric not null check (precio_hora >= 0),
  horas       text[] not null default '{}',
  activa      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seed inicial: una sola cancha. Editar barrio/foto/precio/horas en el dashboard.
insert into canchas (nombre, barrio, foto_url, formato_id, precio_hora, horas) values
  (
    'Parque Heredia',
    'Pie de la Popa',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
    'FUTBOL5',
    100000,
    array['6:00 PM','7:00 PM','8:00 PM','9:00 PM']
  );

-- ============================================================
-- 2. picaos referencia la cancha elegida (las columnas cancha_nombre/barrio/
--    precio_cancha_hora/formato_id se mantienen como snapshot al crear)
-- ============================================================

alter table picaos add column cancha_id uuid references canchas(id);
-- Snapshot del apodo del organizador (evita leer otros usuarios, bloqueado por RLS).
alter table picaos add column organizador_apodo text;
-- Conteo de cupos ocupados (lo incrementan las inscripciones en el paso 6; hoy 0).
alter table picaos add column cupos_ocupados int not null default 0;

-- ============================================================
-- 3. Admin: bandera para gestionar canchas (CRUD in-app a futuro)
-- ============================================================

alter table usuarios add column es_admin boolean not null default false;

-- ============================================================
-- 4. RLS de canchas: lectura pública, escritura solo admins
-- ============================================================

alter table canchas enable row level security;

create policy "canchas_lectura_publica" on canchas
  for select using (true);

create policy "canchas_admin_insert" on canchas
  for insert with check (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.es_admin)
  );
create policy "canchas_admin_update" on canchas
  for update using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.es_admin)
  );
create policy "canchas_admin_delete" on canchas
  for delete using (
    exists (select 1 from usuarios u where u.id = auth.uid() and u.es_admin)
  );

-- ============================================================
-- 5. Búsqueda de picao por código (acceso a privados conociendo el PCO)
--    SECURITY DEFINER: el código es la autorización, así que se salta la RLS.
-- ============================================================

create or replace function buscar_picao_por_codigo(p_codigo text)
returns setof picaos
language sql
security definer
set search_path = public
as $$
  select * from picaos where codigo = upper(trim(p_codigo)) limit 1;
$$;
