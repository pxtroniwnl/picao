-- Picao — cédula como identificador único del jugador + limpieza de columnas redundantes.

-- 1. Quitar columnas que no se usan / quedaron redundantes con las tablas muchos-a-muchos.
alter table usuarios drop column if exists barrio;
alter table usuarios drop column if exists nivel;
alter table usuarios drop column if exists zona_preferida;
alter table usuarios drop column if exists posicion_id;

-- 2. Cédula: identificador real del jugador (único). El UUID `id` sigue siendo la PK
--    técnica (enlace con auth.users y FKs); la cédula es la clave de negocio.
alter table usuarios add column if not exists cedula text;
create unique index if not exists usuarios_cedula_key on usuarios (cedula);
