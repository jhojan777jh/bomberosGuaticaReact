# SPA React + Vite - Bomberos Guática

Panel administrativo del Cuerpo de Bomberos de Guática. **React + Vite + React Router + Tailwind**, con backend **Supabase** (Postgres + Auth).

## Funcionalidades

- Login real con Supabase Auth (correo y contraseña)
- Dashboard con estadísticas en vivo
- Tareas: crear, cambiar estado, eliminar (admin)
- Capacitaciones: crear, inscripción/cancelación de cupos, eliminar (admin)
- Donaciones: registrar, aprobar/rechazar, eliminar (admin)
- Usuarios: listar perfiles, cambiar rol y suspender cuentas (admin)
- RLS (Row Level Security) activo en todas las tablas

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto gratis.
2. Abre **SQL Editor → New query**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecuta.
3. Crea el primer usuario en **Authentication → Users → Add user** (correo + contraseña).
4. Promuévelo a administrador en el SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'tu-correo@dominio.com';
```

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa los datos de **Project Settings → API**:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

> `.env` está en `.gitignore`. Nunca subas la `service_role key` al frontend.

## 3. Instalación y uso

```bash
npm install
npm run dev
```

## 4. Despliegue (GitHub Pages)

```bash
npm run deploy
```

El build se hace en local, por lo que toma las variables de `.env`. Para automatizar con GitHub Actions, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como *repository secrets*.

## Estructura

```
src/
├── components/    # Layout, UI (Modal, StatCard, etc.)
├── context/       # Auth (Supabase) y Theme
├── lib/           # Cliente Supabase
├── pages/         # Login, Dashboard, Tareas, Capacitaciones, Donaciones, Usuarios
├── services/      # API: consultas a Supabase
└── assets/
supabase/
└── schema.sql     # Tablas, triggers y políticas RLS
```

## Seguridad

- La `anon key` es pública (va en el bundle). La protección real la da **RLS**.
- Solo usuarios autenticados y activos pueden escribir.
- Crear usuarios y asignar contraseñas se hace desde el panel de Supabase.
- La `service_role key` **nunca** debe ir en el frontend.
