import { desc, eq } from 'drizzle-orm'
import { getDb, isDatabaseConfigured } from './db'
import { testimonials, type TestimonialRow } from './schema'
import { testimonials as defaultTestimonials } from './site'

export type Review = {
  id: string
  name: string
  location: string | null
  rating: number
  quote: string
  approved: boolean
  createdAt: Date
}

function normalize(row: TestimonialRow): Review {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    rating: row.rating,
    quote: row.quote,
    approved: row.approved,
    createdAt: row.createdAt,
  }
}

/** Avis de secours si la base est injoignable (les trois avis d'origine). */
export const fallbackReviews: Review[] = defaultTestimonials.map((review, index) => ({
  id: `fallback-${index}`,
  name: review.name,
  location: review.location,
  rating: review.rating,
  quote: review.quote,
  approved: true,
  createdAt: new Date(0),
}))

/** Avis publiés, les plus récents d'abord (9 maximum sur la page d'accueil). */
export async function getApprovedReviews(): Promise<Review[]> {
  if (!isDatabaseConfigured()) return fallbackReviews

  try {
    const rows = await getDb()
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt))
      .limit(9)

    return rows.map(normalize)
  } catch (error) {
    console.error('[reviews] lecture des avis impossible, avis par défaut utilisés :', error)
    return fallbackReviews
  }
}

/** Tous les avis, en attente puis publiés (usage admin). */
export async function getAllReviews(): Promise<Review[]> {
  if (!isDatabaseConfigured()) return fallbackReviews

  try {
    const rows = await getDb().select().from(testimonials).orderBy(desc(testimonials.createdAt))
    return rows.map(normalize)
  } catch (error) {
    console.error('[reviews] lecture des avis impossible :', error)
    return fallbackReviews
  }
}
