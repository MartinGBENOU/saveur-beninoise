import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

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
