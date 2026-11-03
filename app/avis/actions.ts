'use server'

import { revalidatePath } from 'next/cache'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { testimonials } from '@/lib/schema'

export type ReviewState = { error?: string; success?: boolean } | null

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitReview(_previous: ReviewState, formData: FormData): Promise<ReviewState> {
  const name = readText(formData, 'name')
  const location = readText(formData, 'location')
  const quote = readText(formData, 'quote')
  const rating = Number.parseInt(readText(formData, 'rating'), 10)

  // Piège à robots : un vrai visiteur ne remplit jamais ce champ caché.
  if (readText(formData, 'website')) {
    return { success: true }
  }

  if (name.length < 2 || name.length > 60) {
    return { error: 'Indiquez votre prénom (2 à 60 caractères).' }
  }
  if (location.length > 60) {
    return { error: 'Le quartier est limité à 60 caractères.' }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Choisissez une note entre 1 et 5 étoiles.' }
  }
  if (quote.length < 10 || quote.length > 500) {
    return { error: 'Votre avis doit contenir entre 10 et 500 caractères.' }
  }
  if (!isDatabaseConfigured()) {
    return { error: "Les avis ne sont pas disponibles pour le moment. Écrivez-nous sur WhatsApp." }
  }

  try {
    await getDb().insert(testimonials).values({
      name,
      location: location || null,
      rating,
      quote,
      approved: false,
    })
  } catch (error) {
    console.error('[reviews] enregistrement d’un avis impossible :', error)
    return { error: "Votre avis n'a pas pu être envoyé. Réessayez dans un instant." }
  }

  revalidatePath('/admin/avis')
  return { success: true }
}
