import { asc, eq } from 'drizzle-orm'
import { getDb, isDatabaseConfigured } from './db'
import { dishes as dishesTable, type DishRow } from './schema'
import { defaultDishes, type Dish } from './site'

export type MenuDish = Dish & {
  available: boolean
  sortOrder: number
}

/** Photos disponibles dans /public/images, proposées dans l'admin. */
export const DISH_IMAGES = [
  { value: '/images/poulet-braise.webp', label: 'Poulet braisé' },
  { value: '/images/amiwo.webp', label: 'Amiwo' },
  { value: '/images/alloco.webp', label: 'Alloco' },
  { value: '/images/sauce-arachide.webp', label: 'Sauce arachide' },
  { value: '/images/brochettes.webp', label: 'Brochettes' },
  { value: '/images/poisson-braise.webp', label: 'Poisson braisé' },
  { value: '/images/hero.webp', label: 'Photo d’ambiance (hero)' },
] as const

/** Menu de secours, dans l'ordre du site historique. */
export const fallbackMenu: MenuDish[] = defaultDishes.map((dish, index) => ({
  ...dish,
  available: true,
  sortOrder: index,
}))

function normalize(row: DishRow): MenuDish {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    tag: row.tag ?? undefined,
    available: row.available,
    sortOrder: row.sortOrder,
  }
}

/**
 * Tous les plats, y compris ceux marqués épuisés (usage admin).
 * Si la base est injoignable, on renvoie le menu de secours : le site reste debout.
 */
export async function getAllDishes(): Promise<MenuDish[]> {
  if (!isDatabaseConfigured()) return fallbackMenu

  try {
    const rows = await getDb()
      .select()
      .from(dishesTable)
      .orderBy(asc(dishesTable.sortOrder), asc(dishesTable.name))

    return rows.map(normalize)
  } catch (error) {
    console.error('[menu] lecture de la carte impossible, menu de secours utilisé :', error)
    return fallbackMenu
  }
}

/** Carte publique : uniquement les plats disponibles. */
export async function getMenu(): Promise<MenuDish[]> {
  const all = await getAllDishes()
  return all.filter((dish) => dish.available)
}

/**
 * Retrouve un plat par son slug.
 * `null` signifie « ce plat n'existe plus » ; en cas de panne, on retombe sur le menu de secours.
 */
export async function getDishBySlug(slug: string): Promise<MenuDish | null> {
  if (isDatabaseConfigured()) {
    try {
      const [row] = await getDb()
        .select()
        .from(dishesTable)
        .where(eq(dishesTable.slug, slug))
        .limit(1)

      return row ? normalize(row) : null
    } catch (error) {
      console.error('[menu] recherche du plat impossible, menu de secours utilisé :', error)
    }
  }

  return fallbackMenu.find((dish) => dish.slug === slug) ?? null
}
