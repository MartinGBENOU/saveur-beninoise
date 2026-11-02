'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { orders } from '@/lib/schema'
import { checkPassword, clearAdminSession, isAdminAuthenticated, setAdminSession } from '@/lib/admin-auth'

const ALLOWED_STATUSES = ['nouvelle', 'confirmée', 'livrée', 'annulée'] as const

export async function login(_previousState: { error: string } | null, formData: FormData) {
  const password = formData.get('password')

  if (typeof password !== 'string' || !checkPassword(password)) {
    return { error: 'Mot de passe incorrect.' }
  }

  await setAdminSession()
  revalidatePath('/admin')
  redirect('/admin')
}

export async function logout() {
  await clearAdminSession()
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateOrderStatus(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return
  }

  const id = formData.get('id')
  const status = formData.get('status')

  if (typeof id !== 'string' || !id) return
  if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) return

  try {
    await getDb().update(orders).set({ status }).where(eq(orders.id, id))
    revalidatePath('/admin')
  } catch (error) {
    console.error('[admin] mise à jour du statut impossible :', error)
  }
}
