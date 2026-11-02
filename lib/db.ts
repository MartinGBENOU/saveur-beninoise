import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function createDb(connectionString: string) {
  return drizzle(neon(connectionString), { schema })
}

export type Database = ReturnType<typeof createDb>

let client: Database | null = null

/**
 * Connexion paresseuse : rien n'est ouvert tant que la première requête n'est pas faite.
 * La variable DATABASE_URL est injectée automatiquement par l'intégration Neon sur Vercel.
 */
export function getDb(): Database {
  if (client) return client

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL est absente. Ajoutez la base Neon au projet Vercel puis lancez `vercel env pull .env.local`.',
    )
  }

  client = createDb(connectionString)
  return client
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export { schema }
