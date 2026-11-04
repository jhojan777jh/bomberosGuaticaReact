import { supabase } from '../lib/supabase'

const NOT_CONFIGURED = 'Supabase no configurado. Crea .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'

const fail = (error) => ({ success: false, message: error?.message ?? error ?? 'Error desconocido' })

const withClient = async (fn) => {
  if (!supabase) return { success: false, message: NOT_CONFIGURED }
  try {
    return await fn(supabase)
  } catch (error) {
    return fail(error)
  }
}

const toTask = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  status: row.status,
  priority: row.priority,
  createdAt: row.created_at,
})

const toTraining = (row, userId) => {
  const enrollments = row.training_enrollments ?? []
  return {
    id: row.id,
    name: row.name,
    date: row.date,
    time: (row.time ?? '').slice(0, 5),
    capacity: row.capacity,
    enrolled: enrollments.length,
    isEnrolled: enrollments.some((item) => item.profile_id === userId),
  }
}

const toDonation = (row) => ({
  id: row.id,
  donor: row.donor,
  amount: Number(row.amount),
  status: row.status,
  note: row.note ?? '',
  date: row.donated_at,
  createdAt: row.created_at,
})

const toProfile = (row) => ({
  id: row.id,
  email: row.email,
  name: row.full_name || row.email,
  role: row.role,
  isActive: row.is_active,
  createdAt: row.created_at,
})

const API = {
  content: {
    stats: () =>
      withClient(async (db) => {
        const [profiles, trainings, donations, tasks] = await Promise.all([
          db.from('profiles').select('*', { count: 'exact', head: true }),
          db.from('trainings').select('*', { count: 'exact', head: true }),
          db.from('donations').select('*', { count: 'exact', head: true }),
          db.from('tasks').select('*', { count: 'exact', head: true }),
        ])
        const error = profiles.error ?? trainings.error ?? donations.error ?? tasks.error
        if (error) return fail(error)
        return {
          success: true,
          stats: {
            usuarios: profiles.count ?? 0,
            capacitaciones: trainings.count ?? 0,
            donaciones: donations.count ?? 0,
            tareas: tasks.count ?? 0,
          },
        }
      }),
  },

  tasks: {
    get: () =>
      withClient(async (db) => {
        const { data, error } = await db
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) return fail(error)
        return { success: true, tasks: (data ?? []).map(toTask) }
      }),

    create: (data, userId) =>
      withClient(async (db) => {
        const { data: row, error } = await db
          .from('tasks')
          .insert({
            title: data.title,
            description: data.description ?? '',
            priority: data.priority ?? 'medium',
            status: data.status ?? 'pending',
            created_by: userId,
          })
          .select()
          .single()
        if (error) return fail(error)
        return { success: true, task: toTask(row) }
      }),

    setStatus: (id, status) =>
      withClient(async (db) => {
        const { error } = await db.from('tasks').update({ status }).eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),

    remove: (id) =>
      withClient(async (db) => {
        const { error } = await db.from('tasks').delete().eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),
  },

  training: {
    get: (userId) =>
      withClient(async (db) => {
        const { data, error } = await db
          .from('trainings')
          .select('*, training_enrollments(profile_id)')
          .order('date', { ascending: true })
        if (error) return fail(error)
        return { success: true, trainings: (data ?? []).map((row) => toTraining(row, userId)) }
      }),

    create: (data, userId) =>
      withClient(async (db) => {
        const { error } = await db.from('trainings').insert({
          name: data.name,
          date: data.date,
          time: data.time,
          capacity: Number(data.capacity),
          created_by: userId,
        })
        if (error) return fail(error)
        return { success: true }
      }),

    enroll: (trainingId, userId) =>
      withClient(async (db) => {
        const { error } = await db
          .from('training_enrollments')
          .insert({ training_id: trainingId, profile_id: userId })
        if (error) return fail(error)
        return { success: true }
      }),

    unenroll: (trainingId, userId) =>
      withClient(async (db) => {
        const { error } = await db
          .from('training_enrollments')
          .delete()
          .eq('training_id', trainingId)
          .eq('profile_id', userId)
        if (error) return fail(error)
        return { success: true }
      }),

    remove: (id) =>
      withClient(async (db) => {
        const { error } = await db.from('trainings').delete().eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),
  },

  donations: {
    get: () =>
      withClient(async (db) => {
        const { data, error } = await db
          .from('donations')
          .select('*')
          .order('donated_at', { ascending: false })
        if (error) return fail(error)
        return { success: true, donations: (data ?? []).map(toDonation) }
      }),

    create: (data, userId) =>
      withClient(async (db) => {
        const { error } = await db.from('donations').insert({
          donor: data.donor,
          amount: Number(data.amount),
          note: data.note ?? '',
          donated_at: data.date || new Date().toISOString().slice(0, 10),
          created_by: userId,
        })
        if (error) return fail(error)
        return { success: true }
      }),

    setStatus: (id, status) =>
      withClient(async (db) => {
        const { error } = await db.from('donations').update({ status }).eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),

    remove: (id) =>
      withClient(async (db) => {
        const { error } = await db.from('donations').delete().eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),
  },

  users: {
    get: () =>
      withClient(async (db) => {
        const { data, error } = await db
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: true })
        if (error) return fail(error)
        return { success: true, users: (data ?? []).map(toProfile) }
      }),

    update: (id, patch) =>
      withClient(async (db) => {
        const payload = {}
        if (patch.role) payload.role = patch.role
        if (typeof patch.isActive === 'boolean') payload.is_active = patch.isActive
        if (patch.name !== undefined) payload.full_name = patch.name
        const { error } = await db.from('profiles').update(payload).eq('id', id)
        if (error) return fail(error)
        return { success: true }
      }),
  },
}

export default API
