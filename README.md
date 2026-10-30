# SPA React + Vite - Bomberos Guática

## Descripción
SPA construido con React + Vite + React Router + React Bootstrap. **Sin backend PHP/MySQL**. Todos los datos son mock y las llamadas a API están stubadas para implementar después.

## Tecnologías
- React 18
- Vite
- React Router DOM
- React Bootstrap + Bootstrap 5
- Bootstrap Icons
- Chart.js + React Chartjs-2

## Características
- Login con autenticación simulada (demo: admin/admin)
- Dashboard con estadísticas
- Gestión de tareas (visual)
- Gestión de capacitaciones (visual)
- Gestión de donaciones (visual)
- Gestión de usuarios (visual)
- Todas las funciones marcadas con [TODO] o [API STUB] para implementación futura

## Instalación y uso
`ash
npm install
npm run dev
`

## Estructura
`
src/
├── components/    # Componentes reutilizables (Layout)
├── context/       # Context API (AuthContext)
├── pages/         # Páginas (Login, Dashboard, etc.)
├── services/      # API stubs
└── assets/        # Recursos gráficos
`

## Notas
- Las peticiones están centralizadas en src/services/api.js
- Para conectar backend: reemplazar stubs con llamadas fetch/axios reales
- Los datos persisten solo en memoria durante la sesión
