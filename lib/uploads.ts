import { eq } from 'drizzle-orm'
import { getDb, isDatabaseConfigured } from './db'
import { uploads } from './schema'

/** Photos acceptées (le navigateur convertit en WebP avant l'envoi). */
const ALLOWED_MIME = new Set(['image/webp', 'image/jpeg', 'image/png'])

/** Taille maximale du fichier décodé : 2,5 Mo (le corps de requête Vercel est limité à ~4,5 Mo). */
const MAX_BYTES = 2.5 * 1024 * 1024

const DATA_URL_PATTERN = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/]+={0,2})$/

const UPLOAD_PATH_PATTERN =
  /^\/api\/uploads\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i

export class UploadError extends Error {}

/**
 * Enregistre une photo envoyée en base64 (data URL) et renvoie son adresse publique.
 * Les photos vivent en base : pas besoin d'un service de stockage externe.
 */
export async function saveUpload(dataUrl: string): Promise<string> {
  if (!isDatabaseConfigured()) {
    throw new UploadError("La base de données n'est pas connectée : impossible d'enregistrer la photo.")
  }

  const match = DATA_URL_PATTERN.exec(dataUrl)
  if (!match) {
    throw new UploadError('Format de photo non reconnu. Utilisez une image JPG, PNG ou WebP.')
  }

  const [, mime, base64] = match
  if (!ALLOWED_MIME.has(mime)) {
    throw new UploadError('Format de photo non reconnu. Utilisez une image JPG, PNG ou WebP.')
  }

  const bytes = Buffer.from(base64, 'base64')
  if (bytes.length === 0) {
    throw new UploadError("La photo envoyée est vide. Choisissez une autre image.")
  }
  if (bytes.length > MAX_BYTES) {
    throw new UploadError('La photo est trop lourde (2,5 Mo maximum). Choisissez une image plus légère.')
  }

  const [row] = await getDb()
    .insert(uploads)
    .values({ mime, data: base64 })
    .returning({ id: uploads.id })

  if (!row) {
    throw new UploadError("La photo n'a pas pu être enregistrée. Réessayez dans un instant.")
  }

  return `/api/uploads/${row.id}`
}

/** Supprime une photo envoyée précédemment (si l'adresse en désigne une). */
export async function deleteUploadByPath(path: string | null | undefined) {
  if (!path) return
  const match = UPLOAD_PATH_PATTERN.exec(path)
  if (!match) return

  try {
    await getDb().delete(uploads).where(eq(uploads.id, match[1]))
  } catch (error) {
    // Un nettoyage raté ne doit pas faire échouer l'enregistrement du plat.
    console.error('[uploads] suppression de la photo impossible :', error)
  }
}

/** Vérifie qu'une adresse est bien une photo envoyée par l'admin. */
export function isUploadPath(path: string) {
  return UPLOAD_PATH_PATTERN.test(path)
}
