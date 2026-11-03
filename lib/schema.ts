import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Commandes passées depuis le site.
 * Chaque commande est enregistrée puis récapitulée dans WhatsApp.
 */
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerName: text('customer_name').notNull(),
    phone: text('phone').notNull(),
    dish: text('dish').notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
    total: integer('total').notNull(),
    address: text('address').notNull(),
    notes: text('notes'),
    status: text('status').notNull().default('nouvelle'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('orders_created_at_idx').on(table.createdAt),
    index('orders_status_idx').on(table.status),
  ],
)

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

/**
 * Carte du restaurant, modifiable depuis /admin/menu.
 * Le slug sert d'identifiant stable : il ne change pas quand le plat est renommé,
 * ce qui garde les liens « Commander ce plat » valides.
 */
export const dishes = pgTable(
  'dishes',
  {
    slug: text('slug').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    image: text('image').notNull(),
    tag: text('tag'),
    available: boolean('available').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('dishes_sort_order_idx').on(table.sortOrder)],
)

export type DishRow = typeof dishes.$inferSelect
export type NewDishRow = typeof dishes.$inferInsert

/**
 * Textes du site (clé → valeur). Les clés et les valeurs par défaut vivent dans lib/content.ts.
 * Seules les valeurs modifiées depuis /admin/texte sont stockées ici.
 */
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type SettingRow = typeof settings.$inferSelect

/**
 * Avis clients. Un avis envoyé depuis le site est enregistré avec `approved = false`
 * et n'apparaît qu'après validation dans /admin/avis.
 */
export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    location: text('location'),
    rating: integer('rating').notNull().default(5),
    quote: text('quote').notNull(),
    approved: boolean('approved').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('testimonials_approved_created_idx').on(table.approved, table.createdAt)],
)

export type TestimonialRow = typeof testimonials.$inferSelect
export type NewTestimonialRow = typeof testimonials.$inferInsert

/**
 * Photos de plats envoyées depuis l'admin, stockées en base (base64) pour éviter
 * un service de stockage externe. Servies par /api/uploads/[id].
 */
export const uploads = pgTable('uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  mime: text('mime').notNull(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type UploadRow = typeof uploads.$inferSelect
