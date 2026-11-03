'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { testimonials } from '@/lib/schema'

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function revalidateReviews() {
  revalidatePath('/admin/avis')
  revalidatePath('/')
}

function sendMessage(message: string, type: 'ok' | 'erreur' = 'ok'): never {
  redirect(`/admin/avis?${type}=${encodeURIComponent(message)}`)
}

async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }
}

function assertDatabase() {
  if (!isDatabaseConfigured()) {
    sendMessage("La base de données n'est pas connectée : impossible de gérer les avis.", 'erreur')
  }
}

export async function setReviewApproval(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const id = readText(formData, 'id')
  const approved = readText(formData, 'approved') === 'true'

  if (!id) sendMessage('Avis introuvable.', 'erreur')

  try {
    await getDb().update(testimonials).set({ approved }).where(eq(testimonials.id, id))
  } catch (error) {
    console.error('[admin] mise à jour d’un avis impossible :', error)
    sendMessage("Impossible de modifier cet avis. Réessayez dans un instant.", 'erreur')
  }

  revalidateReviews()
  sendMessage(approved ? "L'avis est maintenant publié sur le site." : "L'avis a été retiré du site.")
}

export async function deleteReview(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const id = readText(formData, 'id')
  if (!id) sendMessage('Avis introuvable.', 'erreur')

  try {
    await getDb().delete(testimonials).where(eq(testimonials.id, id))
  } catch (error) {
    console.error('[admin] suppression d’un avis impossible :', error)
    sendMessage("Impossible de supprimer cet avis. Réessayez dans un instant.", 'erreur')
  }

  revalidateReviews()
  sendMessage("L'avis a été supprimé définitivement.")
}
