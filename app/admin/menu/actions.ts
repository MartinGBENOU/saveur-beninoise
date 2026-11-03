'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { asc, eq, max } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { DISH_IMAGES } from '@/lib/menu'
import { dishes } from '@/lib/schema'
import { defaultDishes } from '@/lib/site'
import { deleteUploadByPath, isUploadPath, saveUpload, UploadError } from '@/lib/uploads'

const MIN_PRICE = 100
const MAX_PRICE = 100_000

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function revalidateMenu() {
  revalidatePath('/admin/menu')
  revalidatePath('/')
  revalidatePath('/commander')
}

function sendMessage(message: string, type: 'ok' | 'erreur' = 'erreur'): never {
  redirect(`/admin/menu?${type}=${encodeURIComponent(message)}`)
}

async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin')
  }
}

function assertDatabase() {
  if (!isDatabaseConfigured()) {
    sendMessage("La base de données n'est pas connectée : impossible d'enregistrer la carte.")
  }
}

function slugify(value: string) {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)

  return slug || 'plat'
}

async function uniqueSlug(base: string) {
  const rows = await getDb().select({ slug: dishes.slug }).from(dishes)
  const taken = new Set(rows.map((row) => row.slug))

  if (!taken.has(base)) return base

  let suffix = 2
  while (taken.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

/**
 * Valide les champs du plat et détermine sa photo :
 * une nouvelle photo envoyée (data URL) est enregistrée en base et remplace la précédente.
 */
async function parseDishInput(formData: FormData, previousImage?: string) {
  const name = readText(formData, 'name')
  const description = readText(formData, 'description')
  const price = Number.parseInt(readText(formData, 'price'), 10)
  const tag = readText(formData, 'tag')
  const photoData = readText(formData, 'photoData')
  let image = readText(formData, 'image')

  if (name.length < 2 || name.length > 80) {
    sendMessage('Le nom du plat doit contenir entre 2 et 80 caractères.')
  }
  if (description.length < 5 || description.length > 300) {
    sendMessage('La description doit contenir entre 5 et 300 caractères.')
  }
  if (!Number.isInteger(price) || price < MIN_PRICE || price > MAX_PRICE) {
    sendMessage(`Le prix doit être un nombre entre ${MIN_PRICE} et ${MAX_PRICE.toLocaleString('fr-FR')} F.`)
  }
  if (tag.length > 40) {
    sendMessage('Le badge est limité à 40 caractères.')
  }

  if (photoData) {
    try {
      image = await saveUpload(photoData)
    } catch (error) {
      if (error instanceof UploadError) {
        sendMessage(error.message)
      }
      console.error('[uploads] enregistrement de la photo impossible :', error)
      sendMessage("La photo n'a pas pu être enregistrée. Réessayez dans un instant.")
    }
  }

  const knownImage =
    DISH_IMAGES.some((option) => option.value === image) || (previousImage !== undefined && image === previousImage)

  if (!image || (!knownImage && !isUploadPath(image))) {
    sendMessage('Choisissez une photo pour ce plat.')
  }

  return { name, description, price, image, tag: tag || null }
}

export async function createDish(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const input = await parseDishInput(formData)
  const available = formData.get('available') !== null

  try {
    const slug = await uniqueSlug(slugify(input.name))
    const [row] = await getDb().select({ highest: max(dishes.sortOrder) }).from(dishes)
    const sortOrder = (row?.highest ?? -1) + 1

    await getDb().insert(dishes).values({ slug, ...input, available, sortOrder })
  } catch (error) {
    console.error('[admin] ajout d’un plat impossible :', error)
    sendMessage("Impossible d'ajouter ce plat. Réessayez dans un instant.")
  }

  revalidateMenu()
  sendMessage(`« ${input.name} » a été ajouté à la carte.`, 'ok')
}

export async function updateDish(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const slug = readText(formData, 'slug')
  if (!slug) sendMessage('Plat introuvable.')

  let previousImage: string | null = null
  try {
    const [row] = await getDb()
      .select({ image: dishes.image })
      .from(dishes)
      .where(eq(dishes.slug, slug))
      .limit(1)
    previousImage = row?.image ?? null
  } catch (error) {
    console.error('[admin] lecture du plat impossible :', error)
    sendMessage('Impossible de retrouver ce plat. Réessayez dans un instant.')
  }

  if (!previousImage) sendMessage('Plat introuvable.')

  const input = await parseDishInput(formData, previousImage ?? undefined)
  const available = formData.get('available') !== null

  try {
    await getDb()
      .update(dishes)
      .set({ ...input, available, updatedAt: new Date() })
      .where(eq(dishes.slug, slug))
  } catch (error) {
    console.error('[admin] mise à jour d’un plat impossible :', error)
    sendMessage("Impossible d'enregistrer les modifications. Réessayez dans un instant.")
  }

  if (previousImage && previousImage !== input.image) {
    await deleteUploadByPath(previousImage)
  }

  revalidateMenu()
  sendMessage(`Les informations de « ${input.name} » ont été enregistrées.`, 'ok')
}

export async function deleteDish(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const slug = readText(formData, 'slug')
  const name = readText(formData, 'name')
  if (!slug) sendMessage('Plat introuvable.')

  let image: string | null = null

  try {
    const [row] = await getDb()
      .select({ image: dishes.image })
      .from(dishes)
      .where(eq(dishes.slug, slug))
      .limit(1)
    image = row?.image ?? null

    await getDb().delete(dishes).where(eq(dishes.slug, slug))
  } catch (error) {
    console.error('[admin] suppression d’un plat impossible :', error)
    sendMessage('Impossible de supprimer ce plat. Réessayez dans un instant.')
  }

  await deleteUploadByPath(image)

  revalidateMenu()
  sendMessage(`« ${name} » a été retiré de la carte.`, 'ok')
}

export async function moveDish(formData: FormData) {
  await assertAdmin()
  assertDatabase()

  const slug = readText(formData, 'slug')
  const direction = readText(formData, 'direction')
  if (!slug || (direction !== 'up' && direction !== 'down')) return

  try {
    const rows = await getDb()
      .select()
      .from(dishes)
      .orderBy(asc(dishes.sortOrder), asc(dishes.name))

    const index = rows.findIndex((row) => row.slug === slug)
    const target = direction === 'up' ? index - 1 : index + 1

    if (index === -1 || target < 0 || target >= rows.length) return

    const current = rows[index]
    const neighbour = rows[target]

    await getDb().update(dishes).set({ sortOrder: neighbour.sortOrder }).where(eq(dishes.slug, current.slug))
    await getDb().update(dishes).set({ sortOrder: current.sortOrder }).where(eq(dishes.slug, neighbour.slug))
  } catch (error) {
    console.error('[admin] déplacement d’un plat impossible :', error)
    sendMessage('Impossible de déplacer ce plat. Réessayez dans un instant.')
  }

  revalidateMenu()
}

export async function restoreDefaultMenu() {
  await assertAdmin()
  assertDatabase()

  let existing: { slug: string }[] = []
  try {
    existing = await getDb().select({ slug: dishes.slug }).from(dishes).limit(1)
  } catch (error) {
    console.error('[admin] lecture de la carte impossible :', error)
    sendMessage('Impossible de lire la carte. Réessayez dans un instant.')
  }

  if (existing.length > 0) {
    sendMessage('La carte contient déjà des plats : la restauration est réservée à une carte vide.')
  }

  try {
    await getDb()
      .insert(dishes)
      .values(
        defaultDishes.map((dish, index) => ({
          ...dish,
          tag: dish.tag ?? null,
          available: true,
          sortOrder: index,
        })),
      )
  } catch (error) {
    console.error('[admin] restauration du menu impossible :', error)
    sendMessage('Impossible de restaurer le menu de départ. Réessayez dans un instant.')
  }

  revalidateMenu()
  sendMessage('Le menu de départ a été restauré.', 'ok')
}
