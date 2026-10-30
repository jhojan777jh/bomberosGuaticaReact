// API Stub - Todos los endpoints marcados para implementación futura
const API = {
  auth: {
    login: async (credentials) => {
      console.log('[API STUB] POST /auth/login - TODO: Implementar backend', credentials)
      await new Promise(r => setTimeout(r, 300))
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        return { success: true, user: { id: 1, username: 'admin', role: 'Administrador', name: 'Administrador' }, token: 'mock-token-123' }
      }
      return { success: false, message: 'Credenciales inválidas (demo: admin/admin)' }
    },
    logout: async () => {
      console.log('[API STUB] POST /auth/logout - TODO: Implementar backend')
      await new Promise(r => setTimeout(r, 200))
      return { success: true }
    }
  },
  tasks: {
    get: async () => {
      console.log('[API STUB] GET /tasks/get - TODO: Implementar backend')
      await new Promise(r => setTimeout(r, 200))
      return { success: true, tasks: [
        { id: 1, title: 'Revisar inventario', description: 'Verificar equipos y materiales', status: 'pending', priority: 'high' },
        { id: 2, title: 'Mantenimiento de vehículos', description: 'Revisión semanal', status: 'in_progress', priority: 'high' },
        { id: 3, title: 'Capacitación mensual', description: 'Preparar material', status: 'completed', priority: 'medium' }
      ]}
    },
    create: async (data) => {
      console.log('[API STUB] POST /tasks/create - TODO: Implementar backend', data)
      await new Promise(r => setTimeout(r, 300))
      return { success: true, task: { id: Date.now(), ...data, status: 'pending' } }
    }
  },
  content: {
    stats: async () => {
      console.log('[API STUB] GET /content/stats - TODO: Implementar backend')
      await new Promise(r => setTimeout(r, 200))
      return { success: true, stats: { usuarios: 15, capacitaciones: 8, donaciones: 23, tareas: 12 } }
    }
  },
  training: {
    get: async () => {
      console.log('[API STUB] GET /training/get - TODO: Implementar backend')
      await new Promise(r => setTimeout(r, 200))
      return { success: true, trainings: [
        { id: 1, name: 'RCP Básico', date: '2026-11-05', time: '08:00', capacity: 20, enrolled: 15 },
        { id: 2, name: 'Incendios Forestales', date: '2026-11-10', time: '14:00', capacity: 15, enrolled: 12 }
      ]}
    }
  }
}

export default API
