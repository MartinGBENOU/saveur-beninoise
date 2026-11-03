import { eq } from 'drizzle-orm'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { uploads } from '@/lib/schema'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Sert les photos de plats stockées en base.
 * L'adresse est stable et le contenu ne change jamais : cache long.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!UUID_PATTERN.test(id) || !isDatabaseConfigured()) {
    return new Response('Photo introuvable', { status: 404 })
  }

  try {
    const [row] = await getDb().select().from(uploads).where(eq(uploads.id, id)).limit(1)

    if (!row) {
      return new Response('Photo introuvable', { status: 404 })
    }

    const bytes = new Uint8Array(Buffer.from(row.data, 'base64'))

    return new Response(bytes, {
      headers: {
        'Content-Type': row.mime,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[uploads] lecture de la photo impossible :', error)
    return new Response('Photo momentanément indisponible', { status: 503 })
  }
}
