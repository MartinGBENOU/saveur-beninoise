'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { inArray, sql } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { contentGroups, defaultSiteContent, type ContentKey } from '@/lib/content'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { settings } from '@/lib/schema'

const MAX_LENGTH = 5000

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : null
}

function revalidateContent() {
  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/commander')
  revalidatePath('/admin/texte')
}

function sendMessage(message: string, type: 'ok' | 'erreur' = 'ok'): never {
  redirect(`/admin/texte?${type}=${encodeURIComponent(message)}`)
}

async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }
}

export async function saveContent(formData: FormData) {
  await assertAdmin()

  if (!isDatabaseConfigured()) {
    sendMessage("La base de données n'est pas connectée : impossible d'enregistrer les textes.", 'erreur')
  }

  const fields = contentGroups.flatMap((group) => group.fields)
  const overrides: { key: ContentKey; value: string }[] = []
  const resetKeys: ContentKey[] = []

  for (const field of fields) {
    const value = readText(formData, field.key)

    // Un champ absent du formulaire n'est pas touché (robustesse si un champ est ajouté plus tard).
    if (value === null) continue

    if (value.length === 0) {
      sendMessage(`Le champ « ${field.label} » ne peut pas être vide.`, 'erreur')
    }
    if (value.length > MAX_LENGTH) {
      sendMessage(`Le champ « ${field.label} » est limité à ${MAX_LENGTH} caractères.`, 'erreur')
    }

    if (value === defaultSiteContent[field.key]) {
      resetKeys.push(field.key)
    } else {
      overrides.push({ key: field.key, value })
    }
  }

  try {
    const db = getDb()

    if (overrides.length > 0) {
      await db
        .insert(settings)
        .values(overrides)
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: sql`excluded.value`, updatedAt: sql`excluded.updated_at` },
        })
    }

    if (resetKeys.length > 0) {
      await db.delete(settings).where(inArray(settings.key, resetKeys))
    }
  } catch (error) {
    console.error('[admin] enregistrement des textes impossible :', error)
    sendMessage("Impossible d'enregistrer les textes. Réessayez dans un instant.", 'erreur')
  }

  revalidateContent()
  sendMessage('Les textes du site ont été enregistrés.')
}

export async function restoreContent() {
  await assertAdmin()

  if (!isDatabaseConfigured()) {
    sendMessage("La base de données n'est pas connectée : impossible de restaurer les textes.", 'erreur')
  }

  try {
    await getDb().delete(settings)
  } catch (error) {
    console.error('[admin] restauration des textes impossible :', error)
    sendMessage('Impossible de restaurer les textes d’origine. Réessayez dans un instant.', 'erreur')
  }

  revalidateContent()
  sendMessage('Tous les textes d’origine ont été restaurés.')
}
