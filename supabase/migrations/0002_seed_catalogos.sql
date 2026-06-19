-- Picao — datos de referencia: catálogos (formatos + posiciones).
-- Van como migración (no como seed.sql) porque son reference data que debe existir
-- en producción: así `supabase db push` los provisiona junto al esquema.
-- Idempotente: se puede correr varias veces sin duplicar.

-- ============================================================
-- Formatos y cupos (CLAUDE.md §6)
-- ============================================================

insert into formatos (id, label, cupos_totales) values
  ('FUTBOL5',  'Fútbol 5',  10),
  ('FUTBOL7',  'Fútbol 7',  14),
  ('FUTBOL8',  'Fútbol 8',  16),
  ('FUTBOL11', 'Fútbol 11', 22)
on conflict (id) do update
  set label = excluded.label,
      cupos_totales = excluded.cupos_totales;

-- ============================================================
-- Posiciones por formato y zona (§5)
-- La zona es propiedad de la posición. El jugador elige zona (obligatorio)
-- y opcionalmente la posición específica.
-- ============================================================

insert into posiciones (formato_id, zona, nombre) values
  -- FUTBOL5
  ('FUTBOL5',  'ARQUERO', 'Arquero'),
  ('FUTBOL5',  'DEFENSA', 'Cierre'),
  ('FUTBOL5',  'MEDIO',   'Ala derecha'),
  ('FUTBOL5',  'MEDIO',   'Ala izquierda'),
  ('FUTBOL5',  'ATAQUE',  'Pívot'),

  -- FUTBOL7
  ('FUTBOL7',  'ARQUERO', 'Arquero'),
  ('FUTBOL7',  'DEFENSA', 'Defensa central'),
  ('FUTBOL7',  'DEFENSA', 'Lateral'),
  ('FUTBOL7',  'MEDIO',   'Volante'),
  ('FUTBOL7',  'ATAQUE',  'Extremo'),
  ('FUTBOL7',  'ATAQUE',  'Delantero'),

  -- FUTBOL8
  ('FUTBOL8',  'ARQUERO', 'Arquero'),
  ('FUTBOL8',  'DEFENSA', 'Defensa central'),
  ('FUTBOL8',  'DEFENSA', 'Lateral'),
  ('FUTBOL8',  'MEDIO',   'Volante de marca'),
  ('FUTBOL8',  'MEDIO',   'Volante de creación'),
  ('FUTBOL8',  'ATAQUE',  'Extremo'),
  ('FUTBOL8',  'ATAQUE',  'Delantero'),

  -- FUTBOL11
  ('FUTBOL11', 'ARQUERO', 'Arquero'),
  ('FUTBOL11', 'DEFENSA', 'Defensa central'),
  ('FUTBOL11', 'DEFENSA', 'Lateral derecho'),
  ('FUTBOL11', 'DEFENSA', 'Lateral izquierdo'),
  ('FUTBOL11', 'MEDIO',   'Volante de contención'),
  ('FUTBOL11', 'MEDIO',   'Mediocampista'),
  ('FUTBOL11', 'MEDIO',   'Mediapunta'),
  ('FUTBOL11', 'ATAQUE',  'Extremo derecho'),
  ('FUTBOL11', 'ATAQUE',  'Extremo izquierdo'),
  ('FUTBOL11', 'ATAQUE',  'Delantero centro')
on conflict (formato_id, nombre) do nothing;
