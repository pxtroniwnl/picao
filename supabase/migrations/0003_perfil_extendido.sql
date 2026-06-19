-- Picao — perfil extendido (paso 3): campos extra de usuario, catálogo de posiciones
-- con código estable, y tablas muchos-a-muchos para zonas/posiciones del jugador.

-- ============================================================
-- 1. Campos extra del perfil
-- ============================================================

alter table usuarios add column if not exists fecha_nacimiento date;
alter table usuarios add column if not exists barrio text;
alter table usuarios add column if not exists nivel text;

-- ============================================================
-- 2. Catálogo de posiciones con código estable (puente con el front)
-- Se re-siembra: el catálogo de 0002 se reemplaza por uno alineado al
-- selector de cancha (src/data/posiciones.ts), cubriendo los 4 formatos.
-- Seguro: aún no hay usuarios ni referencias.
-- ============================================================

alter table posiciones add column if not exists codigo text;

delete from posiciones;

insert into posiciones (formato_id, zona, nombre, codigo) values
  -- FUTBOL5
  ('FUTBOL5',  'ARQUERO', 'Portero',           'F5_POR'),
  ('FUTBOL5',  'DEFENSA', 'Cierre',            'F5_CIE'),
  ('FUTBOL5',  'MEDIO',   'Ala Izq.',          'F5_ALI'),
  ('FUTBOL5',  'MEDIO',   'Ala Der.',          'F5_ALD'),
  ('FUTBOL5',  'ATAQUE',  'Pívot',             'F5_PIV'),

  -- FUTBOL7
  ('FUTBOL7',  'ARQUERO', 'Portero',           'F7_POR'),
  ('FUTBOL7',  'DEFENSA', 'Lateral Izq.',      'F7_LI'),
  ('FUTBOL7',  'DEFENSA', 'Defensa',           'F7_DFC'),
  ('FUTBOL7',  'DEFENSA', 'Lateral Der.',      'F7_LD'),
  ('FUTBOL7',  'MEDIO',   'Medio Centro',      'F7_MC'),
  ('FUTBOL7',  'ATAQUE',  'Extremo Izq.',      'F7_EI'),
  ('FUTBOL7',  'ATAQUE',  'Extremo Der.',      'F7_ED'),
  ('FUTBOL7',  'ATAQUE',  'Delantero',         'F7_DEL'),

  -- FUTBOL8
  ('FUTBOL8',  'ARQUERO', 'Portero',           'F8_POR'),
  ('FUTBOL8',  'DEFENSA', 'Lateral Izq.',      'F8_LI'),
  ('FUTBOL8',  'DEFENSA', 'Defensa Central',   'F8_DFC'),
  ('FUTBOL8',  'DEFENSA', 'Lateral Der.',      'F8_LD'),
  ('FUTBOL8',  'MEDIO',   'Volante',           'F8_MCD'),
  ('FUTBOL8',  'MEDIO',   'Medio Izq.',        'F8_MI'),
  ('FUTBOL8',  'MEDIO',   'Medio Der.',        'F8_MD'),
  ('FUTBOL8',  'ATAQUE',  'Delantero',         'F8_DC'),

  -- FUTBOL11
  ('FUTBOL11', 'ARQUERO', 'Portero',           'F11_POR'),
  ('FUTBOL11', 'DEFENSA', 'Lateral Izq.',      'F11_LI'),
  ('FUTBOL11', 'DEFENSA', 'Central Izq.',      'F11_CTI'),
  ('FUTBOL11', 'DEFENSA', 'Central Der.',      'F11_CTD'),
  ('FUTBOL11', 'DEFENSA', 'Lateral Der.',      'F11_LD'),
  ('FUTBOL11', 'MEDIO',   'Mediocentro Def.',  'F11_MCD'),
  ('FUTBOL11', 'MEDIO',   'Mediocentro Izq.',  'F11_MI'),
  ('FUTBOL11', 'MEDIO',   'Mediocentro Der.',  'F11_MD'),
  ('FUTBOL11', 'MEDIO',   'Mediapunta',        'F11_MP'),
  ('FUTBOL11', 'ATAQUE',  'Extremo Izq.',      'F11_EI'),
  ('FUTBOL11', 'ATAQUE',  'Extremo Der.',      'F11_ED'),
  ('FUTBOL11', 'ATAQUE',  'Delantero',         'F11_DC');

alter table posiciones alter column codigo set not null;
alter table posiciones add constraint posiciones_codigo_key unique (codigo);

-- ============================================================
-- 3. Zonas del jugador (muchos-a-muchos)
-- ============================================================

create table usuario_zonas (
  usuario_id uuid not null references usuarios(id) on delete cascade,
  zona       zona not null,
  primary key (usuario_id, zona)
);

alter table usuario_zonas enable row level security;

create policy "usuario_zonas_lectura_propia" on usuario_zonas
  for select using (auth.uid() = usuario_id);
create policy "usuario_zonas_insert_propia" on usuario_zonas
  for insert with check (auth.uid() = usuario_id);
create policy "usuario_zonas_delete_propia" on usuario_zonas
  for delete using (auth.uid() = usuario_id);

-- ============================================================
-- 4. Posiciones del jugador (muchos-a-muchos)
-- ============================================================

create table usuario_posiciones (
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  posicion_id uuid not null references posiciones(id) on delete cascade,
  primary key (usuario_id, posicion_id)
);

create index usuario_posiciones_usuario_idx on usuario_posiciones (usuario_id);

alter table usuario_posiciones enable row level security;

create policy "usuario_posiciones_lectura_propia" on usuario_posiciones
  for select using (auth.uid() = usuario_id);
create policy "usuario_posiciones_insert_propia" on usuario_posiciones
  for insert with check (auth.uid() = usuario_id);
create policy "usuario_posiciones_delete_propia" on usuario_posiciones
  for delete using (auth.uid() = usuario_id);
