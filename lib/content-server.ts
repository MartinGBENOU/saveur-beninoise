import { getDb, isDatabaseConfigured } from './db'
import { settings } from './schema'
import { defaultSiteContent, type ContentKey, type SiteContent } from './content'

export * from './content'

/**
 * Charge les textes depuis la base, en retombant sur les valeurs par défaut
 * si la base est vide ou injoignable.
 *
 * Ce module touche la base : il ne doit être importé que par des composants serveur.
 * Les composants client importent `lib/content.ts`, qui est sans dépendance serveur.
 */
export async function getContent(): Promise<SiteContent> {
  const content: SiteContent = { ...defaultSiteContent }
  if (!isDatabaseConfigured()) return content

  try {
    const rows = await getDb().select().from(settings)
    for (const row of rows) {
      if (row.key in content) {
        content[row.key as ContentKey] = row.value
      }
    }
  } catch (error) {
    console.error('[content] lecture des textes impossible, valeurs par défaut utilisées :', error)
  }

  return content
}
